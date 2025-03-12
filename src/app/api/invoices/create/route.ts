import { createClient } from "../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse form data
    const invoiceNumber = formData.get("invoice_number") as string;
    const clientId = formData.get("client_id") as string;
    const dueDate = formData.get("due_date") as string;
    const notes = formData.get("notes") as string;
    const paymentMethodId = formData.get("payment_method_id") as string;

    // Parse invoice items
    const itemsData = [];
    let subtotal = 0;

    // Get the number of items from the form data
    const itemKeys = Array.from(formData.keys()).filter((key) =>
      key.startsWith("items["),
    );
    const itemIndices = new Set<number>();

    itemKeys.forEach((key) => {
      const match = key.match(/items\[(\d+)\]/);
      if (match) {
        itemIndices.add(parseInt(match[1]));
      }
    });

    // Process each item
    for (const index of itemIndices) {
      const description = formData.get(
        `items[${index}][description]`,
      ) as string;
      const quantity = parseInt(
        (formData.get(`items[${index}][quantity]`) as string) || "1",
      );
      const unitPrice = parseFloat(
        (formData.get(`items[${index}][unit_price]`) as string) || "0",
      );
      const amount = quantity * unitPrice;

      if (description && !isNaN(amount)) {
        itemsData.push({
          description,
          quantity,
          unit_price: unitPrice,
          amount,
        });
        subtotal += amount;
      }
    }

    // Get tax settings
    const { data: taxSettings } = await supabase
      .from("tax_settings")
      .select("*")
      .eq("business_id", user.id)
      .eq("enabled", true)
      .single();

    // Calculate tax amount
    const taxRate = taxSettings?.tax_rate || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + taxAmount;

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        business_id: user.id,
        client_id: clientId,
        invoice_number: invoiceNumber,
        amount: subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        status: "pending",
        due_date: new Date(dueDate).toISOString(),
        payment_method_id: paymentMethodId === "none" ? null : paymentMethodId,
        notes,
      })
      .select()
      .single();

    if (invoiceError) {
      return NextResponse.json(
        { error: invoiceError.message },
        { status: 500 },
      );
    }

    // Create invoice items
    if (itemsData.length > 0) {
      const invoiceItems = itemsData.map((item) => ({
        ...item,
        invoice_id: invoice.id,
      }));

      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(invoiceItems);

      if (itemsError) {
        return NextResponse.json(
          { error: itemsError.message },
          { status: 500 },
        );
      }
    }

    // Update invoice settings to increment the next invoice number
    await supabase
      .from("invoice_settings")
      .update({ next_invoice_number: supabase.sql`next_invoice_number + 1` })
      .eq("business_id", user.id);

    // Create payment transaction if payment method is provided
    if (paymentMethodId && paymentMethodId !== "none") {
      await supabase.from("payment_transactions").insert({
        business_id: user.id,
        invoice_id: invoice.id,
        amount: totalAmount,
        payment_method: paymentMethodId,
        status: "completed",
        metadata: { auto_generated: true },
      });

      // Update invoice status to paid
      await supabase
        .from("invoices")
        .update({
          status: "paid",
          paid_date: new Date().toISOString(),
        })
        .eq("id", invoice.id);
    }

    // Redirect to the invoice detail page
    return NextResponse.redirect(
      new URL(`/dashboard/invoices/${invoice.id}`, request.url),
    );
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 },
    );
  }
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  Upload,
  Image,
  Palette,
  Type,
  FileText,
  Facebook,
  Twitter,
  Instagram,
  Phone,
  ExternalLink,
  Check,
  Loader2,
  AlertCircle,
  Eye,
  Link as LinkIcon,
  Save,
  Copy,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface BookingPageSettings {
  booking_page_url: string;
  logo_url: string;
  banner_url: string;
  theme_color: string;
  page_title: string;
  page_description: string;
  show_testimonials: boolean;
  social_links: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    tiktok?: string;
  };
  contact_number: string;
  other_links: Array<{ label: string; url: string }>;
  custom_domain?: string;
}

export default function BookingPageSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlAvailable, setUrlAvailable] = useState<boolean | null>(null);
  const [checkingUrl, setCheckingUrl] = useState(false);
  const [activeTab, setActiveTab] = useState("url");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [customDomain, setCustomDomain] = useState(false);

  const [settings, setSettings] = useState<BookingPageSettings>({
    booking_page_url: "happypaws",
    logo_url: "",
    banner_url: "",
    theme_color: "#FC8D68",
    page_title: "Book Your Pet Services",
    page_description: "Schedule your pet's next appointment with us!",
    show_testimonials: true,
    social_links: {
      facebook: "",
      twitter: "",
      instagram: "",
      tiktok: "",
    },
    contact_number: "",
    other_links: [{ label: "", url: "" }],
  });

  // Fetch booking page settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);

        // In a real app, this would be an API call
        // For now, we'll simulate a delay and use default values
        setTimeout(() => {
          setSettings({
            booking_page_url: "happypaws",
            logo_url:
              "https://images.unsplash.com/photo-1560743641-3914f2c45636?w=300&q=80",
            banner_url:
              "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80",
            theme_color: "#FC8D68",
            page_title: "Happy Paws Pet Grooming",
            page_description:
              "Professional pet grooming services for dogs and cats. Book your appointment today!",
            show_testimonials: true,
            social_links: {
              facebook: "https://facebook.com/happypaws",
              twitter: "https://twitter.com/happypaws",
              instagram: "https://instagram.com/happypaws",
              tiktok: "",
            },
            contact_number: "+60123456789",
            other_links: [
              { label: "Our Blog", url: "https://happypaws.com/blog" },
              { label: "", url: "" },
            ],
          });
          setLogoPreview(
            "https://images.unsplash.com/photo-1560743641-3914f2c45636?w=300&q=80",
          );
          setBannerPreview(
            "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80",
          );
          setUrlAvailable(true);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to load booking page settings");
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const checkUrlAvailability = async () => {
    if (!settings.booking_page_url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      });
      return;
    }

    try {
      setCheckingUrl(true);

      // In a real app, this would be an API call
      // For now, we'll simulate a delay and random availability
      setTimeout(() => {
        // Always available if it's the current URL
        if (settings.booking_page_url === "happypaws") {
          setUrlAvailable(true);
        } else {
          // Random availability for demo purposes
          const isAvailable = Math.random() > 0.3;
          setUrlAvailable(isAvailable);
        }
        setCheckingUrl(false);
      }, 1000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to check URL availability",
        variant: "destructive",
      });
      setCheckingUrl(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (field === "booking_page_url") {
      // Reset availability check when URL changes
      setUrlAvailable(null);
      // Format URL: lowercase, no spaces, alphanumeric and hyphens only
      value = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    }

    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value,
      },
    }));
  };

  const handleOtherLinkChange = (
    index: number,
    field: "label" | "url",
    value: string,
  ) => {
    const newLinks = [...settings.other_links];
    newLinks[index][field] = value;

    // Add a new empty link if the last one is being filled
    if (
      index === newLinks.length - 1 &&
      value &&
      newLinks[index].label &&
      newLinks[index].url
    ) {
      newLinks.push({ label: "", url: "" });
    }

    setSettings((prev) => ({
      ...prev,
      other_links: newLinks,
    }));
  };

  const removeOtherLink = (index: number) => {
    if (settings.other_links.length <= 1) return;

    const newLinks = [...settings.other_links];
    newLinks.splice(index, 1);

    setSettings((prev) => ({
      ...prev,
      other_links: newLinks,
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setSettings((prev) => ({
          ...prev,
          logo_url: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
        setSettings((prev) => ({
          ...prev,
          banner_url: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `https://gopet.ai/${settings.booking_page_url}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveSettings = async () => {
    if (!settings.booking_page_url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a booking page URL",
        variant: "destructive",
      });
      return;
    }

    if (urlAvailable === false) {
      toast({
        title: "Error",
        description: "The URL is not available. Please choose another one.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      // In a real app, this would be an API call
      // For now, we'll simulate a delay
      setTimeout(() => {
        toast({
          title: "Success",
          description: "Booking page settings saved successfully",
        });
        setSaving(false);
      }, 1500);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save booking page settings",
        variant: "destructive",
      });
      setSaving(false);
    }
  };

  const openPreview = () => {
    // In a real app, this would open the booking page in a new tab
    window.open(`https://gopet.ai/${settings.booking_page_url}`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#FC8D68]" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Booking Page Settings</CardTitle>
              <CardDescription>
                Customize how clients see and book your services online
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="url">URL & Preview</TabsTrigger>
                  <TabsTrigger value="branding">Branding</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="links">Links</TabsTrigger>
                </TabsList>

                {/* URL & Preview Tab */}
                <TabsContent value="url" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="booking_page_url"
                        className="flex items-center gap-2"
                      >
                        <Globe className="h-4 w-4 text-gray-500" />
                        Booking Page URL
                      </Label>
                      <div className="flex mt-1">
                        <div className="bg-gray-100 flex items-center px-3 rounded-l-md border border-r-0 border-gray-300">
                          <span className="text-gray-500 text-sm">
                            gopet.ai/
                          </span>
                        </div>
                        <Input
                          id="booking_page_url"
                          value={settings.booking_page_url}
                          onChange={(e) =>
                            handleInputChange(
                              "booking_page_url",
                              e.target.value,
                            )
                          }
                          className="rounded-l-none"
                          placeholder="your-business-name"
                        />
                        <Button
                          variant="outline"
                          className="ml-2"
                          onClick={checkUrlAvailability}
                          disabled={checkingUrl}
                        >
                          {checkingUrl ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Check Availability"
                          )}
                        </Button>
                      </div>
                      {urlAvailable === true && (
                        <p className="text-green-600 text-sm mt-1 flex items-center">
                          <Check className="h-4 w-4 mr-1" /> URL is available
                        </p>
                      )}
                      {urlAvailable === false && (
                        <p className="text-red-600 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" /> URL is not
                          available
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <Label className="text-base font-medium mb-2 block">
                        Your Booking Page Link
                      </Label>
                      <div className="flex items-center">
                        <Input
                          value={`https://gopet.ai/${settings.booking_page_url}`}
                          readOnly
                          className="bg-gray-50"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="ml-2"
                          onClick={copyToClipboard}
                        >
                          {copied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          className="ml-2"
                          onClick={openPreview}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Share this link with your clients to let them book
                        appointments online
                      </p>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <Switch
                          id="custom-domain"
                          checked={customDomain}
                          onCheckedChange={setCustomDomain}
                        />
                        <Label
                          htmlFor="custom-domain"
                          className="ml-2 cursor-pointer"
                        >
                          Use custom domain
                        </Label>
                      </div>
                    </div>
                    {customDomain && (
                      <div className="mt-4 p-4 border rounded-md bg-white">
                        <Label htmlFor="custom-domain-input">
                          Custom Domain
                        </Label>
                        <Input
                          id="custom-domain-input"
                          placeholder="booking.yourbusiness.com"
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          You'll need to set up DNS records to point your domain
                          to our servers.
                          <Button variant="link" className="h-auto p-0 text-xs">
                            View instructions
                          </Button>
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Branding Tab */}
                <TabsContent value="branding" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="logo_url"
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4 text-gray-500" />
                        Business Logo
                      </Label>
                      <div className="mt-1 flex items-start gap-4">
                        <div className="w-24 h-24 border rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                          {logoPreview ? (
                            <img
                              src={logoPreview}
                              alt="Business Logo"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Upload className="h-8 w-8 text-gray-300" />
                          )}
                        </div>
                        <div className="flex-1">
                          <Input
                            id="logo_url"
                            value={settings.logo_url}
                            onChange={(e) =>
                              handleInputChange("logo_url", e.target.value)
                            }
                            placeholder="https://example.com/your-logo.png"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Enter a URL or upload your logo (recommended size:
                            200x200px)
                          </p>
                          <Input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoChange}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() =>
                              document.getElementById("logo-upload")?.click()
                            }
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Logo
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <Label
                        htmlFor="banner_url"
                        className="flex items-center gap-2"
                      >
                        <Image className="h-4 w-4 text-gray-500" />
                        Page Banner (Optional)
                      </Label>
                      <div className="mt-1">
                        <div className="w-full h-32 border rounded-md overflow-hidden bg-gray-50 flex items-center justify-center mb-2">
                          {bannerPreview ? (
                            <img
                              src={bannerPreview}
                              alt="Page Banner"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Image className="h-8 w-8 text-gray-300" />
                          )}
                        </div>
                        <Input
                          id="banner_url"
                          value={settings.banner_url}
                          onChange={(e) =>
                            handleInputChange("banner_url", e.target.value)
                          }
                          placeholder="https://example.com/your-banner.jpg"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Enter a URL or upload a banner image (recommended
                          size: 1200x400px)
                        </p>
                        <Input
                          id="banner-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleBannerChange}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() =>
                            document.getElementById("banner-upload")?.click()
                          }
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Banner
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <Label
                        htmlFor="theme_color"
                        className="flex items-center gap-2"
                      >
                        <Palette className="h-4 w-4 text-gray-500" />
                        Theme Color
                      </Label>
                      <div className="mt-1 flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-md border"
                          style={{ backgroundColor: settings.theme_color }}
                        ></div>
                        <Input
                          id="theme_color"
                          type="color"
                          value={settings.theme_color}
                          onChange={(e) =>
                            handleInputChange("theme_color", e.target.value)
                          }
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={settings.theme_color}
                          onChange={(e) =>
                            handleInputChange("theme_color", e.target.value)
                          }
                          className="w-32"
                          placeholder="#FC8D68"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        This color will be used for buttons and accents on your
                        booking page
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Content Tab */}
                <TabsContent value="content" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="page_title"
                        className="flex items-center gap-2"
                      >
                        <Type className="h-4 w-4 text-gray-500" />
                        Page Title
                      </Label>
                      <Input
                        id="page_title"
                        value={settings.page_title}
                        onChange={(e) =>
                          handleInputChange("page_title", e.target.value)
                        }
                        className="mt-1"
                        placeholder="Your Business Name"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        This will appear as the main heading on your booking
                        page
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <Label
                        htmlFor="page_description"
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4 text-gray-500" />
                        Page Description
                      </Label>
                      <Textarea
                        id="page_description"
                        value={settings.page_description}
                        onChange={(e) =>
                          handleInputChange("page_description", e.target.value)
                        }
                        className="mt-1 resize-none"
                        rows={4}
                        placeholder="Describe your services..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        A brief description of your business and services
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="show_testimonials"
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <span>Show Client Testimonials</span>
                        </Label>
                        <Switch
                          id="show_testimonials"
                          checked={settings.show_testimonials}
                          onCheckedChange={(checked) =>
                            handleInputChange("show_testimonials", checked)
                          }
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Display testimonials from your clients on your booking
                        page
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Links Tab */}
                <TabsContent value="links" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium mb-4 block">
                        Social Media Links
                      </Label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Facebook className="h-5 w-5 text-blue-600" />
                          <Input
                            value={settings.social_links.facebook || ""}
                            onChange={(e) =>
                              handleSocialLinkChange("facebook", e.target.value)
                            }
                            placeholder="https://facebook.com/your-page"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <Twitter className="h-5 w-5 text-blue-400" />
                          <Input
                            value={settings.social_links.twitter || ""}
                            onChange={(e) =>
                              handleSocialLinkChange("twitter", e.target.value)
                            }
                            placeholder="https://twitter.com/your-handle"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <Instagram className="h-5 w-5 text-pink-600" />
                          <Input
                            value={settings.social_links.instagram || ""}
                            onChange={(e) =>
                              handleSocialLinkChange(
                                "instagram",
                                e.target.value,
                              )
                            }
                            placeholder="https://instagram.com/your-handle"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <svg
                            className="h-5 w-5 text-black"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                          </svg>
                          <Input
                            value={settings.social_links.tiktok || ""}
                            onChange={(e) =>
                              handleSocialLinkChange("tiktok", e.target.value)
                            }
                            placeholder="https://tiktok.com/@your-handle"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <Label
                        htmlFor="contact_number"
                        className="flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4 text-gray-500" />
                        WhatsApp Contact Number
                      </Label>
                      <Input
                        id="contact_number"
                        value={settings.contact_number}
                        onChange={(e) =>
                          handleInputChange("contact_number", e.target.value)
                        }
                        className="mt-1"
                        placeholder="+60123456789"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Include country code (e.g., +60 for Malaysia)
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <Label className="text-base font-medium mb-4 block">
                        Other Links (Optional)
                      </Label>
                      <div className="space-y-3">
                        {settings.other_links.map((link, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={link.label}
                              onChange={(e) =>
                                handleOtherLinkChange(
                                  index,
                                  "label",
                                  e.target.value,
                                )
                              }
                              placeholder="Link Label"
                              className="w-1/3"
                            />
                            <Input
                              value={link.url}
                              onChange={(e) =>
                                handleOtherLinkChange(
                                  index,
                                  "url",
                                  e.target.value,
                                )
                              }
                              placeholder="https://example.com"
                              className="flex-1"
                            />
                            {index > 0 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeOtherLink(index)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M3 6h18" />
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                  <line x1="10" y1="11" x2="10" y2="17" />
                                  <line x1="14" y1="11" x2="14" y2="17" />
                                </svg>
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Add links to your website, blog, or other pages
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="flex items-center gap-2">
                            <LinkIcon className="h-4 w-4 text-gray-500" />
                            Use Custom Domain
                          </Label>
                          <p className="text-xs text-gray-500 mt-1">
                            Connect your own domain to your booking page (Coming
                            Soon)
                          </p>
                        </div>
                        <Button variant="outline" disabled>
                          Coming Soon
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button
                className="bg-[#FC8D68] hover:bg-[#e87e5c]"
                onClick={handleSaveSettings}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="hidden lg:block">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                See how your booking page will look
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border rounded-xl overflow-hidden bg-gray-100 p-2 mx-auto"
                style={{ maxWidth: "300px" }}
              >
                <div className="border rounded-lg overflow-hidden bg-white h-[500px] flex flex-col">
                  {/* Phone Header */}
                  <div className="bg-gray-800 text-white text-xs p-1 text-center relative">
                    <div className="absolute left-2 top-1">9:41</div>
                    <div>gopet.ai</div>
                    <div className="absolute right-2 top-1">100%</div>
                  </div>

                  {/* Booking Page Preview */}
                  <div className="flex-1 overflow-auto">
                    {/* Banner */}
                    {settings.banner_url && (
                      <div className="h-32 bg-gray-200 overflow-hidden">
                        <img
                          src={settings.banner_url}
                          alt="Banner"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Logo and Title */}
                    <div className="p-4 flex flex-col items-center text-center">
                      {settings.logo_url && (
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-white mb-2 border">
                          <img
                            src={settings.logo_url}
                            alt="Logo"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <h2 className="text-lg font-bold">
                        {settings.page_title}
                      </h2>
                      <p className="text-xs text-gray-600 mt-1">
                        {settings.page_description}
                      </p>
                    </div>

                    {/* Services */}
                    <div className="p-4">
                      <h3 className="text-sm font-medium mb-2">Our Services</h3>
                      <div className="space-y-2">
                        <div className="border rounded-md p-2 bg-gray-50">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-xs font-medium">
                                Basic Grooming
                              </div>
                              <div className="text-[10px] text-gray-500">
                                30 min • RM45
                              </div>
                            </div>
                            <button
                              className="text-[10px] px-2 py-1 rounded-md"
                              style={{
                                backgroundColor: settings.theme_color,
                                color: "white",
                              }}
                            >
                              Book
                            </button>
                          </div>
                        </div>
                        <div className="border rounded-md p-2 bg-gray-50">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-xs font-medium">
                                Full Grooming
                              </div>
                              <div className="text-[10px] text-gray-500">
                                60 min • RM75
                              </div>
                            </div>
                            <button
                              className="text-[10px] px-2 py-1 rounded-md"
                              style={{
                                backgroundColor: settings.theme_color,
                                color: "white",
                              }}
                            >
                              Book
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Testimonials */}
                    {settings.show_testimonials && (
                      <div className="p-4">
                        <h3 className="text-sm font-medium mb-2">
                          Client Testimonials
                        </h3>
                        <div className="border rounded-md p-2 bg-gray-50">
                          <div className="text-[10px] italic">
                            "Amazing service! My dog looks fantastic."
                          </div>
                          <div className="text-[10px] font-medium mt-1">
                            - Sarah J.
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Social Links */}
                    <div className="p-4 flex justify-center space-x-3">
                      {settings.social_links.facebook && (
                        <Facebook className="h-4 w-4 text-blue-600" />
                      )}
                      {settings.social_links.twitter && (
                        <Twitter className="h-4 w-4 text-blue-400" />
                      )}
                      {settings.social_links.instagram && (
                        <Instagram className="h-4 w-4 text-pink-600" />
                      )}
                      {settings.social_links.tiktok && (
                        <svg
                          className="h-4 w-4 text-black"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={openPreview}>
                  <Eye className="h-4 w-4 mr-2" />
                  Open Full Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

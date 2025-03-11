import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Mail, MessageSquare, Send, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Communication {
  id: string;
  date: string;
  type: string;
  subject: string;
  content: string;
  staff: string;
}

interface CommunicationHistoryProps {
  communications: Communication[];
}

export default function CommunicationHistory({
  communications,
}: CommunicationHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [newMessage, setNewMessage] = useState({
    type: "Email",
    subject: "",
    content: "",
  });

  const filteredCommunications = communications.filter(
    (comm) =>
      comm.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.type.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSendMessage = () => {
    // In a real app, this would send the message and update the database
    alert("Message sent!");
    setShowNewMessage(false);
    setNewMessage({
      type: "Email",
      subject: "",
      content: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Communication History</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search communications..."
                className="pl-8 h-9 w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button
              className="bg-[#FC8D68] hover:bg-[#e87e5c] h-9"
              onClick={() => setShowNewMessage(!showNewMessage)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Message
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showNewMessage && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-base font-medium mb-4">New Message</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-1/3">
                  <Select
                    value={newMessage.type}
                    onValueChange={(value) =>
                      setNewMessage({ ...newMessage, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select message type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="SMS">SMS</SelectItem>
                      <SelectItem value="Note">Internal Note</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-2/3">
                  <Input
                    placeholder="Subject"
                    value={newMessage.subject}
                    onChange={(e) =>
                      setNewMessage({ ...newMessage, subject: e.target.value })
                    }
                  />
                </div>
              </div>
              <Textarea
                placeholder="Message content"
                className="min-h-[100px]"
                value={newMessage.content}
                onChange={(e) =>
                  setNewMessage({ ...newMessage, content: e.target.value })
                }
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowNewMessage(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#FC8D68] hover:bg-[#e87e5c]"
                  onClick={handleSendMessage}
                  disabled={!newMessage.subject || !newMessage.content}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {filteredCommunications.length > 0 ? (
            filteredCommunications.map((comm) => (
              <div
                key={comm.id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {comm.type === "Email" ? (
                      <Mail className="h-4 w-4 text-blue-500" />
                    ) : comm.type === "SMS" ? (
                      <MessageSquare className="h-4 w-4 text-green-500" />
                    ) : (
                      <MessageSquare className="h-4 w-4 text-gray-500" />
                    )}
                    <h3 className="font-medium">{comm.subject}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{comm.staff}</Badge>
                    <span className="text-xs text-gray-500">{comm.date}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 ml-6">{comm.content}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No communications found matching your search.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

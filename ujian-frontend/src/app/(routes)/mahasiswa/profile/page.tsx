import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  MessageSquare,
  Settings,
} from "lucide-react";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  const user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null;

  if (!user) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-500">Belum login</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={user.avatar} alt={user.nama} />
                  <AvatarFallback className="text-2xl font-semibold bg-blue-600 text-white">
                    {user.nama?.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {user.nama}
                </h2>
                <p className="text-blue-600 font-medium mb-3">
                  Mahasiswa Informatika
                </p>

                {/* Rating */}
                <div className="flex items-center justify-center gap-1 mb-4">
                  <span className="text-2xl font-bold text-gray-900">3.75</span>
                  <div className="flex text-yellow-400 ml-2">
                    {[1, 2, 3, 4].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-current" />
                    ))}
                    <Star className="w-4 h-4 text-gray-300" />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mb-4">
                  <Button size="sm" className="flex-1">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Phone className="w-4 h-4 mr-1" />
                    Contact
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Member
                  </span>
                  <span className="flex items-center gap-1">
                    <Settings className="w-4 h-4" />
                    About
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Info Cards */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Spotify New York
                    </h3>
                    <p className="text-sm text-gray-600">Primary</p>
                    <p className="text-xs text-gray-500">
                      4 Union Square, New York, NY 10003, US
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700"
                  >
                    Primary
                  </Badge>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Metropolitan Museum
                    </h3>
                    <p className="text-sm text-gray-600">Secondary</p>
                    <p className="text-xs text-gray-500">
                      1000 5th Ave, New York, NY 10028, US
                    </p>
                  </div>
                  <Badge variant="outline">Secondary</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              {/* Header */}
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {user.nama}
                    </h1>
                    <p className="text-gray-600">NIM: {user.nip_nim}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Actions
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Phone
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-blue-600">085788141307</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Address
                      </label>
                      <div className="flex items-start gap-2 mt-1">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-gray-900">Jln. Raya No. 123</p>
                          <p className="text-sm text-gray-600">
                            New York, NY 10003 US Zip 100 001
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Email
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-blue-600">
                          hello@jeremyrose.com
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Personal information
                      </label>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Birthday</span>
                          <span className="text-gray-900">June 5, 1992</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Gender</span>
                          <span className="text-gray-900">Male</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Semester</span>
                          <span className="text-gray-900">6</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total SKS</span>
                          <span className="text-gray-900">120</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">IPK</span>
                          <span className="text-gray-900 font-semibold">
                            3.75
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

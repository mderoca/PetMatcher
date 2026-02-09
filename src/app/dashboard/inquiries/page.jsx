'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Clock, CheckCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadInquiries();
  }, []);

  async function loadInquiries() {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: shelter } = await supabase
      .from('shelters')
      .select('id')
      .eq('owner_user_id', user.id)
      .single();

    if (!shelter) return;

    const { data } = await supabase
      .from('inquiries')
      .select(`
        id,
        message,
        status,
        created_at,
        user:profiles!user_id(name, email),
        pet:pets!pet_id(name, breed, photos)
      `)
      .eq('shelter_id', shelter.id)
      .order('created_at', { ascending: false });

    // Transform the data to match our structure
    const transformed = (data || []).map((item) => ({
      id: item.id,
      message: item.message,
      status: item.status,
      created_at: item.created_at,
      user: item.user,
      pet: item.pet,
    }));

    setInquiries(transformed);
    setIsLoading(false);
  }

  async function updateStatus(inquiryId, newStatus) {
    const supabase = createClient();

    const { error } = await supabase
      .from('inquiries')
      .update({ status: newStatus })
      .eq('id', inquiryId);

    if (!error) {
      setInquiries(inquiries.map(inq =>
        inq.id === inquiryId ? { ...inq, status: newStatus } : inq
      ));
    }
  }

  const filteredInquiries = filter === 'all'
    ? inquiries
    : inquiries.filter(inq => inq.status === filter);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    read: 'bg-blue-100 text-blue-700',
    responded: 'bg-green-100 text-green-700',
  };

  const statusIcons = {
    pending: Clock,
    read: Mail,
    responded: CheckCircle,
  };

  return (
    <main className="min-h-dvh bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Adoption Inquiries</h1>
        </div>
      </header>

      <div className="p-6">
        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['all', 'pending', 'read', 'responded'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === status
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-2 text-xs">
                  ({inquiries.filter(i => i.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
            <h2 className="mt-4 text-lg font-semibold text-gray-900">No inquiries yet</h2>
            <p className="mt-2 text-gray-600">
              {filter === 'all'
                ? 'When adopters express interest in your pets, their inquiries will appear here.'
                : `No ${filter} inquiries.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInquiries.map((inquiry) => {
              const StatusIcon = statusIcons[inquiry.status];
              return (
                <div key={inquiry.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="flex">
                    {/* Pet Image */}
                    <div
                      className="w-24 h-24 md:w-32 md:h-32 bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${inquiry.pet.photos[0] || '/placeholder.png'})` }}
                    />

                    {/* Content */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{inquiry.user.name}</h3>
                          <p className="text-sm text-gray-600">
                            Interested in <span className="font-medium">{inquiry.pet.name}</span> ({inquiry.pet.breed})
                          </p>
                        </div>
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColors[inquiry.status]}`}>
                          <StatusIcon className="h-3 w-3" />
                          {inquiry.status}
                        </span>
                      </div>

                      {inquiry.message && (
                        <p className="mt-2 text-sm text-gray-700 line-clamp-2">{inquiry.message}</p>
                      )}

                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {new Date(inquiry.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>

                        <div className="flex gap-2">
                          {inquiry.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(inquiry.id, 'read')}
                            >
                              Mark as Read
                            </Button>
                          )}
                          <a href={`mailto:${inquiry.user.email}?subject=Re: ${inquiry.pet.name} Adoption Inquiry`}>
                            <Button size="sm" onClick={() => updateStatus(inquiry.id, 'responded')}>
                              Reply
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

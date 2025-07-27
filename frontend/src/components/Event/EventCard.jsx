import { ArrowUpRight } from "lucide-react";

export function EventCard({ event }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex max-w-2xl flex-col m-6 items-center rounded-md border md:flex-row">
      <div className="h-full w-full md:h-[200px] md:w-[300px]">
        <img
          src={event.event_image}
          alt="Event"
          className="h-full w-full rounded-md object-cover"
        />
      </div>
      <div>
        <div className="p-4">
          <h1 className="inline-flex items-center text-lg font-semibold">
            {event.title} <ArrowUpRight className="ml-2 h-4 w-4" />
          </h1>
          <p className="mt-3 text-sm text-gray-600">{event.description}</p>
          <div className="mt-4">
            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600 mr-2">
              {event.date}
            </span>
            <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600 mr-2">
              {event.time}
            </span>
            <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-600 mr-2">
              {event.location}
            </span>
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(event.status || 'active')}`}>
              {(event.status || 'active').charAt(0).toUpperCase() + (event.status || 'active').slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

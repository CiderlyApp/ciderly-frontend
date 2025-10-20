import React from 'react';
import { CircleUser, Search, Camera, Calendar, Star, GlassWater, LayoutGrid, Bookmark, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const EventCard = ({ title }: { title: string }) => (
  <div className="flex-shrink-0 w-32 space-y-2 rounded-lg bg-muted/50 p-2">
    <div className="flex items-center justify-center h-16 w-full rounded bg-muted">
      <Calendar className="h-6 w-6 text-muted-foreground" />
    </div>
    <p className="font-semibold text-xs truncate">{title}</p>
  </div>
);

const RecommendationCard = ({ title, icon: Icon, className }: { title: string, icon: React.ElementType, className?: string }) => (
  <div className={cn("flex flex-col items-center justify-center gap-2 rounded-lg border bg-card p-4 h-24", className)}>
    <Icon className="h-5 w-5" />
    <p className="text-xs font-medium">{title}</p>
  </div>
);

const NavItem = ({ title, icon: Icon, active = false }: { title: string, icon: React.ElementType, active?: boolean }) => (
  <div className={cn("flex flex-col items-center gap-1 text-muted-foreground", active && "text-primary")}>
    <Icon className="h-5 w-5" />
    <p className="text-[10px]">{title}</p>
  </div>
);

export const PhoneMockup = () => {
  return (
    <div className="relative mx-auto h-[600px] w-[300px] rounded-[40px] border-2 border-border bg-card p-2 shadow-2xl">
      <div className="h-full w-full overflow-hidden rounded-[32px] bg-background">
        <div className="relative flex h-full flex-col">
          <header className="flex-shrink-0 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CircleUser className="h-6 w-6" />
                <p className="font-semibold">Ciderly</p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" placeholder="Search events, places..." className="w-full rounded-full border-none bg-muted py-2 pl-9 pr-10 text-sm focus:ring-1 focus:ring-primary"/>
              <Camera className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </header>

          <main className="flex-grow overflow-y-auto px-4 space-y-4 pb-16 [&::-webkit-scrollbar]:hidden">
            <section>
              <div className="flex items-baseline justify-between mb-2">
                <h2 className="font-bold">Upcoming Events</h2>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
                <EventCard title="Гастроужин: Сидр и Сыр" />
                <EventCard title="Лекция: История сидра" />
              </div>
            </section>

            <section>
              <div className="flex items-baseline justify-between mb-2">
                <h2 className="font-bold">Nearby</h2>
                <p className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">View on map</p>
              </div>
              <div className="w-full h-32 rounded-lg overflow-hidden bg-gradient-to-b from-blue-100 to-blue-50 relative" style={{backgroundImage: 'linear-gradient(0deg, #5b9bd5 0.5px, transparent 0.5px), linear-gradient(90deg, #5b9bd5 0.5px, transparent 0.5px)', backgroundSize: '25px 25px'}}>
                {/* Streets overlay */}
                
                {/* Map markers */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex gap-8">
                    <div className="flex flex-col items-center">
                      <MapPin className="h-6 w-6 text-red-500" />
                      <p className="text-[10px] mt-1 text-foreground">Event</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <p className="text-[10px] mt-1 text-foreground">Place</p>
                    </div>
                  </div>
                </div>

                {/* Street names */}
                <div className="absolute top-4 left-4 text-[8px] text-blue-700 font-semibold opacity-70">Main St</div>
                <div className="absolute bottom-4 right-4 text-[8px] text-blue-700 font-semibold opacity-70">Park Ave</div>

                {/* Zoom control */}
                <div className="absolute bottom-4 left-4 flex flex-col gap-1">
                  <button className="bg-white rounded border border-gray-300 w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-gray-100">+</button>
                  <button className="bg-white rounded border border-gray-300 w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-gray-100">−</button>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-bold mb-2">Recommendations</h2>
              <div className="grid grid-cols-2 gap-3">
                <RecommendationCard title="Best" icon={Star} className="border-yellow-400/50 text-yellow-400" />
                <RecommendationCard title="New Tastes" icon={GlassWater} className="border-cyan-400/50 text-cyan-400" />
              </div>
            </section>
          </main>

          <footer className="absolute bottom-0 left-0 right-0 h-16 border-t border-muted/50 bg-card/80 backdrop-blur-sm">
            <div className="flex h-full items-center justify-around">
              <NavItem title="Feed" icon={LayoutGrid} />
              <NavItem title="Overview" icon={Search} active={true} />
              <NavItem title="Favorites" icon={Bookmark} />
            </div>
          </footer>
        </div>
      </div>

      <div className="absolute left-1/2 top-3 h-7 w-28 -translate-x-1/2 rounded-full bg-foreground" />
    </div>
  );
};
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import TopBar from "./TopBar";
import DesktopTopNav from "./DesktopTopNav";

export default function AppShell({ profile, children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar username={profile.username} avatarUrl={profile.avatar_url} />

      <div className="flex flex-1">
        <Sidebar username={profile.username} />

        <div className="flex-1 min-w-0 flex flex-col">
          <DesktopTopNav />
          <main className="flex-1 pb-20 md:pb-0">
            {children}
          </main>
        </div>
      </div>

      <MobileNav username={profile.username} />
    </div>
  );
}

import { Bell, CircleAlert, CircleCheckBig, ShieldAlert } from "lucide-react";

const toneStyles = {
  info: {
    icon: Bell,
    badgeClass: "bg-[#eef3f8] text-[#35557e]",
  },
  success: {
    icon: CircleCheckBig,
    badgeClass: "bg-emerald-100 text-emerald-700",
  },
  warning: {
    icon: ShieldAlert,
    badgeClass: "bg-amber-100 text-amber-700",
  },
};

export default function NotificationPanel({ notifications = [] }) {
  return (
    <div className="absolute right-0 top-[calc(100%+0.85rem)] z-[110] w-[22rem] rounded-[1.65rem] border border-[#dbe4ee] bg-white p-4 shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Notifications</p>
          <p className="mt-1 text-xs text-slate-500">Recent activity from your requests and wallet</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {notifications.length ? (
          notifications.map((notification) => {
            const tone = toneStyles[notification.tone] || toneStyles.info;
            const Icon = tone.icon;

            return (
              <div
                key={notification.id}
                className="rounded-[1rem] border border-[#e2eaf2] bg-[#fbfdff] px-3 py-3"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${tone.badgeClass}`}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {notification.title}
                      </p>
                      {notification.unread ? (
                        <span className="h-2.5 w-2.5 rounded-full bg-pink-500" />
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {notification.message}
                    </p>
                    <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                      {notification.postedAt}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-[1rem] border border-[#e2eaf2] bg-[#fbfdff] px-4 py-6 text-center text-sm text-slate-500">
            You are all caught up for now.
          </div>
        )}
      </div>
    </div>
  );
}

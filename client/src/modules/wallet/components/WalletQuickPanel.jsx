import { ArrowDownLeft, ArrowUpRight, Plus } from "lucide-react";

function formatCurrency(value = 0) {
  return `Rs ${new Intl.NumberFormat("en-IN").format(value)}`;
}

export default function WalletQuickPanel({
  wallet,
  onAddMoney,
  onOpenWallet,
}) {
  const recentTransactions = wallet?.recentTransactions || [];

  return (
    <div className="absolute right-0 top-[calc(100%+0.85rem)] z-[110] w-[21rem] rounded-[1.65rem] border border-[#dbe4ee] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
      <div className="overflow-hidden rounded-t-[1.65rem] border-b border-[#e2eaf2] bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] px-5 py-5 text-slate-900">
        <p className="text-sm font-medium text-slate-500">Your Wallet</p>
        <div className="mt-3 flex items-end gap-3">
          <p className="text-4xl font-black tracking-tight text-[#233b5d]">
            {formatCurrency(wallet?.overview?.balance || 0)}
          </p>
          <span className="mb-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Active
          </span>
        </div>
      </div>

      <div className="px-4 pb-4 pt-4">
        <button
          type="button"
          onClick={onAddMoney}
          className="nh-button-primary flex h-11 w-full"
        >
          <Plus size={16} />
          Add Money
        </button>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Recent Transactions
          </p>

          <div className="mt-3 space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-start justify-between gap-3 rounded-[1rem] border border-[#e2eaf2] bg-[#fbfdff] px-3 py-3"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-full ${
                      transaction.type === "credit"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {transaction.type === "credit" ? (
                      <ArrowDownLeft size={16} />
                    ) : (
                      <ArrowUpRight size={16} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {transaction.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{transaction.postedAt}</p>
                  </div>
                </div>
                <p
                  className={`text-sm font-bold ${
                    transaction.type === "credit"
                      ? "text-emerald-700"
                      : "text-rose-700"
                  }`}
                >
                  {transaction.type === "credit" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenWallet}
          className="nh-button-secondary mt-4 w-full"
        >
          View All Transactions
        </button>
      </div>
    </div>
  );
}

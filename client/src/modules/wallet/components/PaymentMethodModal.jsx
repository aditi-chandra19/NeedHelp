import { CreditCard, Landmark, Shield, Smartphone, Wallet } from "lucide-react";

const paymentMethods = [
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "needhelp-wallet", label: "NeedHelp Wallet", icon: Wallet },
  { id: "card", label: "Credit/Debit Card", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", icon: Landmark },
];

function formatCurrency(value = 0) {
  return `Rs ${new Intl.NumberFormat("en-IN").format(value)}`;
}

export default function PaymentMethodModal({
  amount,
  fee,
  total,
  walletBalance,
  paymentData,
  onChange,
  onClose,
  onSubmit,
  isSubmitting,
}) {
  const selectedMethod = paymentData.paymentMethod;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/35 px-4 py-8">
      <div className="w-full max-w-md rounded-[1.8rem] border border-[#dbe4ee] bg-white p-5 shadow-[0_30px_80px_rgba(15,23,42,0.22)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[#233b5d]">
              Complete Payment
            </h2>
            <p className="mt-1 text-sm text-slate-500">Add money to wallet</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xl leading-none text-slate-400 transition hover:text-slate-600"
          >
            x
          </button>
        </div>

        <div className="mt-5 rounded-[1.35rem] bg-[#f5f7fe] px-4 py-4">
          <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
            <span>Task Amount</span>
            <span className="font-semibold text-slate-900">{formatCurrency(amount)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 border-b border-slate-200 pb-3 text-sm text-slate-600">
            <span>Platform Fee</span>
            <span className="font-semibold text-emerald-600">{formatCurrency(fee)}</span>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-2xl font-bold text-slate-900">Total Amount</span>
            <span className="text-3xl font-black text-[#5a4dff]">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-slate-700">Select Payment Method</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedMethod === method.id;

              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => onChange("paymentMethod", method.id)}
                  className={`rounded-[1.15rem] border px-4 py-5 text-center transition ${
                    isSelected
                      ? "border-[#5f80af] bg-[#eef3f8] shadow-[0_16px_32px_rgba(35,59,93,0.08)]"
                      : "border-[#dbe4ee] bg-white hover:bg-[#fbfdff]"
                  }`}
                >
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-transparent text-[#35557e]">
                    <Icon size={22} />
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-900">{method.label}</p>
                  {isSelected ? (
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#35557e]">
                      Selected
                    </p>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {selectedMethod === "upi" ? (
          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="upiId">
              Enter UPI ID
            </label>
            <input
              id="upiId"
              type="text"
              value={paymentData.upiId}
              onChange={(event) => onChange("upiId", event.target.value)}
              placeholder="yourname@upi"
              className="nh-input"
            />
            <p className="mt-2 text-xs text-slate-500">
              We support Google Pay, PhonePe, Paytm, and all UPI apps.
            </p>
          </div>
        ) : null}

        {selectedMethod === "needhelp-wallet" ? (
          <div className="mt-5 rounded-[1.1rem] border border-emerald-200 bg-emerald-50/80 px-4 py-4">
            <p className="text-sm font-medium text-slate-700">Wallet Balance</p>
            <p className="mt-2 text-3xl font-black text-emerald-700">
              {formatCurrency(walletBalance)}
            </p>
          </div>
        ) : null}

        {selectedMethod === "card" ? (
          <div className="mt-5 space-y-3">
            <input
              type="text"
              value={paymentData.cardNumber}
              onChange={(event) => onChange("cardNumber", event.target.value)}
              placeholder="Card Number"
              className="nh-input"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={paymentData.expiry}
                onChange={(event) => onChange("expiry", event.target.value)}
                placeholder="MM/YY"
                className="nh-input"
              />
              <input
                type="password"
                value={paymentData.cvv}
                onChange={(event) => onChange("cvv", event.target.value)}
                placeholder="CVV"
                className="nh-input"
              />
            </div>
            <input
              type="text"
              value={paymentData.cardholderName}
              onChange={(event) => onChange("cardholderName", event.target.value)}
              placeholder="Cardholder Name"
              className="nh-input"
            />
          </div>
        ) : null}

        {selectedMethod === "netbanking" ? (
          <div className="mt-5 rounded-[1.1rem] border border-[#dbe4ee] bg-[#f8fbfe] px-4 py-4 text-sm text-slate-600">
            Net banking is enabled for this demo flow. Tap pay to continue.
          </div>
        ) : null}

        <div className="mt-5 flex items-center gap-2 rounded-[1rem] bg-[#f7f7f5] px-4 py-3 text-sm text-slate-600">
          <Shield size={16} className="text-emerald-600" />
          Your payment is secure and encrypted
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="nh-button-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="nh-button-primary disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Processing..." : `Pay ${formatCurrency(total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Info,
  LoaderCircle,
  Wallet,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { clearStoredSession, getStoredSession } from "../../auth/services/session.js";
import AppPageFrame from "../../common/components/AppPageFrame.jsx";
import PaymentMethodModal from "../components/PaymentMethodModal.jsx";
import { addMoneyToWallet, fetchWallet } from "../services/walletService.js";

function formatCurrency(value = 0) {
  return `Rs ${new Intl.NumberFormat("en-IN").format(value)}`;
}

const initialPaymentData = {
  paymentMethod: "upi",
  upiId: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
  cardholderName: "",
  simulationOutcome: "success",
};

export default function WalletPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const session = getStoredSession();
  const sessionUser = session?.user;
  const [wallet, setWallet] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [showAddMoneyForm, setShowAddMoneyForm] = useState(
    searchParams.get("addMoney") === "1"
  );
  const [amountInput, setAmountInput] = useState("");
  const [paymentData, setPaymentData] = useState(initialPaymentData);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadWallet() {
      try {
        const payload = await fetchWallet();

        if (!isActive) {
          return;
        }

        setWallet(payload);
      } catch (error) {
        if (!isActive) {
          return;
        }

        setStatus({
          type: "error",
          message: error.message || "Unable to load your wallet right now.",
        });
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadWallet();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    setShowAddMoneyForm(searchParams.get("addMoney") === "1");
  }, [searchParams]);

  const currentUser = wallet?.user || sessionUser;
  const amountValue = Number(amountInput) || 0;
  const fee = amountValue
    ? Math.round(amountValue * (wallet?.feeInfo?.platformFeeRate || 0.02)) +
      (wallet?.feeInfo?.flatPlatformFee || 5)
    : 0;
  const totalAmount = amountValue + fee;

  const statementContent = useMemo(() => {
    const transactions = wallet?.transactions || [];

    return transactions
      .map((transaction) => {
        const sign = transaction.type === "credit" ? "+" : "-";
        return `${transaction.postedAt} | ${transaction.title} | ${sign}${formatCurrency(
          transaction.amount
        )} | ${transaction.status}`;
      })
      .join("\n");
  }, [wallet?.transactions]);

  function handleLogout() {
    clearStoredSession();
    navigate("/login", { replace: true });
  }

  function handleOpenAddMoney() {
    setShowAddMoneyForm(true);
    setSearchParams({ addMoney: "1" });
  }

  function handleCloseAddMoney() {
    setShowAddMoneyForm(false);
    setAmountInput("");
    setPaymentData(initialPaymentData);
    setSearchParams({});
  }

  function handlePaymentChange(field, value) {
    setPaymentData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handlePreparePayment() {
    if (amountValue < 100) {
      setStatus({
        type: "error",
        message: "Enter at least Rs 100 before continuing.",
      });
      return;
    }

    setStatus({ type: "", message: "" });
    setShowPaymentModal(true);
  }

  async function handlePay() {
    setIsSubmittingPayment(true);

    try {
      const payload = await addMoneyToWallet({
        amount: amountValue,
        ...paymentData,
      });

      setWallet(payload.wallet);
      setStatus({
        type: "success",
        message: payload.message,
      });
      setAmountInput("");
      setPaymentData(initialPaymentData);
      setShowPaymentModal(false);
      handleCloseAddMoney();
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to process payment right now.",
      });
    } finally {
      setIsSubmittingPayment(false);
    }
  }

  function handleDownloadStatement() {
    if (typeof window === "undefined" || !statementContent) {
      return;
    }

    const blob = new Blob([statementContent], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "needhelp-wallet-statement.txt";
    anchor.click();
    window.URL.revokeObjectURL(url);

    setStatus({
      type: "success",
      message: "Wallet statement downloaded.",
    });
  }

  if (isLoading) {
    return (
      <AppPageFrame onLogout={handleLogout} user={currentUser}>
        <main className="px-4 py-16 md:px-6">
          <div className="nh-panel mx-auto flex max-w-5xl items-center justify-center p-12">
            <div className="inline-flex items-center gap-3 text-slate-500">
              <LoaderCircle size={20} className="animate-spin" />
              Loading wallet...
            </div>
          </div>
        </main>
      </AppPageFrame>
    );
  }

  return (
    <AppPageFrame onLogout={handleLogout} user={currentUser}>
      <main className="px-4 pb-16 pt-10 md:px-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5f7ea8]">
              Payments and balance
            </p>
            <h1 className="mt-3 text-5xl font-black tracking-tight text-[#233b5d]">
              My Wallet
            </h1>
            <p className="mt-2 text-lg text-slate-500">
              Manage your balance and transactions
            </p>
          </div>

          {status.message ? (
            <div className={status.type === "error" ? "nh-status-error" : "nh-status-success"}>
              {status.message}
            </div>
          ) : null}

          <section className="nh-panel overflow-hidden p-6 text-slate-900">
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.15rem] bg-[#233b5d] text-white shadow-[0_12px_26px_rgba(35,59,93,0.16)]">
                  <Wallet size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Available Balance</p>
                  <p className="mt-1 text-6xl font-black tracking-tight">
                    {formatCurrency(wallet?.overview?.balance || 0)}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[1.1rem] border border-[#e1e9f2] bg-[#fbfdff] px-4 py-4">
                  <p className="text-sm text-slate-500">Total Earned</p>
                  <p className="mt-2 text-4xl font-bold">
                    {formatCurrency(wallet?.overview?.totalEarned || 0)}
                  </p>
                </div>
                <div className="rounded-[1.1rem] border border-[#e1e9f2] bg-[#fbfdff] px-4 py-4">
                  <p className="text-sm text-slate-500">Total Spent</p>
                  <p className="mt-2 text-4xl font-bold">
                    {formatCurrency(wallet?.overview?.totalSpent || 0)}
                  </p>
                </div>
                <div className="rounded-[1.1rem] border border-[#e1e9f2] bg-[#fbfdff] px-4 py-4">
                  <p className="text-sm text-slate-500">Platform Fees</p>
                  <p className="mt-2 text-4xl font-bold">
                    {formatCurrency(wallet?.overview?.platformFees || 0)}
                  </p>
                </div>
              </div>

              {!showAddMoneyForm ? (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleOpenAddMoney}
                    className="nh-button-primary h-12 w-full text-base"
                  >
                    Add Money to Wallet
                  </button>
                  <p className="text-sm text-slate-500">
                    Fast wallet top-ups with UPI, cards, net banking, and wallet balance.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
                  <input
                    type="number"
                    min="100"
                    step="50"
                    value={amountInput}
                    onChange={(event) => setAmountInput(event.target.value)}
                    placeholder="Enter amount"
                    className="nh-input h-12"
                  />
                  <button
                    type="button"
                    onClick={handlePreparePayment}
                    className="nh-button-primary h-12 px-7"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseAddMoney}
                    className="nh-button-secondary h-12 px-7"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-[#cfe0fb] bg-[#eef3ff] px-5 py-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#3a76ea] text-white">
                <Info size={16} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#35557e]">Minimal Platform Fees</h2>
                <p className="mt-1 text-sm leading-6 text-[#496484]">
                  {wallet?.feeInfo?.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#35557e]">
                  {(wallet?.feeInfo?.highlights || []).map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-4xl font-black tracking-tight text-slate-900">
                  Transaction History
                </h2>
              </div>
              <button
                type="button"
                onClick={handleDownloadStatement}
                className="nh-button-secondary gap-2 px-4 py-2"
              >
                <Download size={15} />
                Download Statement
              </button>
            </div>

            <div className="space-y-4">
              {(wallet?.transactions || []).map((transaction) => (
                <div
                  key={transaction.id}
                  className="nh-panel flex items-center justify-between gap-4 px-5 py-5"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full ${
                        transaction.type === "credit"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {transaction.type === "credit" ? (
                        <ArrowDownLeft size={18} />
                      ) : (
                        <ArrowUpRight size={18} />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xl font-semibold text-slate-900">
                          {transaction.title}
                        </p>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          {transaction.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">
                        {transaction.postedAt}
                        {transaction.fee ? ` | Fee: ${formatCurrency(transaction.fee)}` : ""}
                        {transaction.note ? ` | ${transaction.note}` : ""}
                      </p>
                    </div>
                  </div>

                  <p
                    className={`text-4xl font-black ${
                      transaction.type === "credit"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {transaction.type === "credit" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {showPaymentModal ? (
        <PaymentMethodModal
          amount={amountValue}
          fee={fee}
          total={totalAmount}
          walletBalance={wallet?.overview?.balance || 0}
          paymentData={paymentData}
          onChange={handlePaymentChange}
          onClose={() => setShowPaymentModal(false)}
          onSubmit={handlePay}
          isSubmitting={isSubmittingPayment}
        />
      ) : null}
    </AppPageFrame>
  );
}

"use client";

import TransactionCard, {
  type TransactionRecord,
} from "@/components/transactions/TransactionCard";
import { useGetTransactionsQuery } from "@/redux/features/transactions/transactionApi";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ScaleLoader } from "react-spinners";

const Transactions = () => {
  const { data: transData, isFetching } = useGetTransactionsQuery(undefined, {
    pollingInterval: 1000 * 60 * 5, // 5 minutes
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // ── safe destructure (avoid `|| []` on object)
  const transactions: TransactionRecord[] = transData?.transactions ?? [];
  console.log(transactions);

  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<TransactionRecord[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transactions.length > 0) {
      setRecords((prev) => [...prev, ...transactions]);
      // ── if backend returns < 10 items, stop infinite-scroll
      if (transactions.length < 10) setHasMore(false);
    } else {
      setHasMore(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions]);

  // ── NOTE: page state এখনো API-তে ব্যবহার করছো না;
  // চাইলে RTK Query-তে pagination parameter যোগ করে দিও।

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    const n = loadMoreRef.current;
    if (n) observer.observe(n);
    return () => {
      if (n) observer.unobserve(n);
    };
  }, [isFetching, hasMore]);

  return (
    <div className="min-h-[80vh] bg-white">
      {records.length > 0 ? (
        <>
          {records.map((record) => (
            <TransactionCard key={record.unique_id} record={record} />
          ))}

          <div ref={loadMoreRef} className="flex justify-center py-4">
            {isFetching ? (
              <ScaleLoader color="#00b894" height={25} />
            ) : !hasMore ? (
              <p className="text-sm text-gray-400">No more records</p>
            ) : null}
          </div>
        </>
      ) : (
        <div className="flex min-h-[80vh] items-center justify-center text-center">
          <div>
            <Image
              src="/images/no-data.gif"
              width={200}
              height={200}
              alt="No Data"
              className="mx-auto"
            />
            <p className="text-sm font-semibold text-gray-500">
              No Records found
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;

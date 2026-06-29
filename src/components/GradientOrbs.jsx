'use client';

export default function GradientOrbs() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-[drift_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] animate-[drift_10s_ease-in-out_infinite_reverse]" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-600/5 rounded-full blur-[80px] animate-[drift_12s_ease-in-out_infinite_2s]" />
    </div>
  );
}

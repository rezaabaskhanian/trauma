'use client';

const DecorativeBlobs = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-100/40 rounded-full blur-[100px]" />
        <div className="absolute top-[30%] left-[10%] w-[20%] h-[20%] bg-pink-100/20 rounded-full blur-[80px]" />
    </div>
);

export default DecorativeBlobs;

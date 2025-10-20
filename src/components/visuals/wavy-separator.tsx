// FILE: src/components/visuals/wavy-separator.tsx
export const WavySeparator = () => {
    return (
        <div className="relative -mb-1 h-20 w-full overflow-hidden text-background">
            <svg
                className="absolute bottom-0 left-0 h-auto w-full"
                preserveAspectRatio="none"
                viewBox="0 0 1200 120"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M321.39 56.44c58-10.79 114.16-30.13 172-41.86 82.39-16.72 168.19-17.73 250.45-.39C823.78 31.7 906.67 72 985.66 92.83c70.05 18.48 146.53 26.09 214.34 3V0H0v56.39z"
                    fill="currentColor"
                ></path>
            </svg>
        </div>
    );
};
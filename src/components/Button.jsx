
export default function Button({
    children,
    onClick,
    variant = 'primary',
    className = '',
    ...props
}) {
    const baseStyle = "px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-indigo-600 text-white shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5",
        secondary: "bg-amber-500 text-white shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5",
        danger: "bg-red-500 text-white shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5",
        outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50",
        ghost: "text-slate-600 hover:bg-slate-100",
    };

    // Note: I am not using Tailwind classes because I didn't install Tailwind (as per instruction). 
    // I will use inline styles or vanilla classes map.
    // Wait, I can't use full Tailwind classes like 'active:scale-95' if Tailwind isn't installed.
    // I must use the CSS classes I defined or inline styles.

    // Let's refactor to use the CSS modules or simple classes.

    let btnClass = `btn btn-${variant} ${className}`;

    return (
        <button className={btnClass} onClick={onClick} {...props}>
            {children}
        </button>
    );
}

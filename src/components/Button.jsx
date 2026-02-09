
export default function Button({
    children,
    onClick,
    variant = 'primary',
    className = '',
    ...props
}) {
    let btnClass = `btn btn-${variant} ${className}`;

    return (
        <button className={btnClass} onClick={onClick} {...props}>
            {children}
        </button>
    );
}

import * as React from 'react'
import "./Text.scss"
import cn from 'clsx'

export type TextProps = {
    className?: string;
    view?: 'title' | 'button' | 'p-20' | 'p-18' | 'p-16' | 'p-14';
    tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p' | 'span';
    weight?: 'normal' | 'medium' | 'bold';
    children: React.ReactNode;
    color?: 'primary' | 'secondary' | 'accent' | 'error';
    maxLines?: number;
};

const Text: React.FC<TextProps> = ({
    className,
    view = 'p-14',
    tag: Tag = 'p',
    weight,
    children,
    color,
    maxLines
}) => {
    return (
        <Tag
            className={cn(
                'text',
                `text_weight-${weight}`,
                `text_view-${view}`,
                color && `text_color-${color}`,
                !!maxLines && `text_multi-ellipsis`,
                className
            )}
            style={{ '--max-lines-count': maxLines } as React.CSSProperties}
        >
            {children}
        </Tag>
    )
}

export default Text;
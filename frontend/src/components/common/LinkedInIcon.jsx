import React from 'react'

export default function LinkedInIcon({ size = 24, className = '', style = {}, fill, color }) {
    const iconColor = fill || color || '#0A66C2'
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={size}
            height={size}
            className={className}
            style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
        >
            <path
                fill={iconColor}
                d="M20,2H4C2.9,2,2,2.9,2,4v16c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2z M8.5,19H5.8V9.7h2.7V19z M7.1,8.5c-0.9,0-1.6-0.7-1.6-1.6c0-0.9,0.7-1.6,1.6-1.6s1.6,0.7,1.6,1.6C8.8,7.8,8,8.5,7.1,8.5z M19,19h-2.7v-4.2c0-1-0.4-1.7-1.3-1.7c-0.7,0-1.1,0.5-1.3,0.9c-0.1,0.2-0.1,0.4-0.1,0.6V19h-2.7V9.7h2.7v1.3c0.4-0.6,1.1-1.4,2.5-1.4c1.8,0,3.2,1.2,3.2,3.8V19z"
            />
        </svg>
    )
}

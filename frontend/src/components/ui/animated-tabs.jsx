import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * AnimatedTabs — Luxury Sliding Pill Tabs with Spring Physics
 */
export function AnimatedTabs({
  tabs = [],
  activeTab,
  onChange,
  className,
  tabClassName,
  activeClassName,
  layoutId = 'animated-tabs-active-pill'
}) {
  return (
    <div
      className={cn(
        'relative flex items-center gap-1.5 p-1 bg-neutral-100 rounded-full border border-neutral-200/80 overflow-x-auto no-scrollbar',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative z-10 flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold rounded-full transition-colors whitespace-nowrap outline-none cursor-pointer select-none',
              isActive
                ? 'text-neutral-900 font-bold'
                : 'text-neutral-500 hover:text-neutral-800',
              tabClassName
            )}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                transition={{
                  type: 'spring',
                  stiffness: 420,
                  damping: 32,
                  mass: 0.8
                }}
                className={cn(
                  'absolute inset-0 bg-white rounded-full shadow-sm border border-neutral-200/60 z-[-1]',
                  activeClassName
                )}
              />
            )}
            {Icon && (
              <Icon
                className={cn(
                  'w-4 h-4 transition-transform duration-200',
                  isActive ? 'scale-110 text-neutral-900' : 'text-neutral-400'
                )}
              />
            )}
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge !== null && (
              <span
                className={cn(
                  'px-1.5 py-0.5 text-[10px] font-bold rounded-full',
                  isActive
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-200 text-neutral-600'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * TabContentWrapper — Smooth optical blur & subtle slide transition between tab contents
 */
export function TabContentWrapper({ children, activeKey, className }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeKey}
        initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -6, filter: 'blur(2px)' }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

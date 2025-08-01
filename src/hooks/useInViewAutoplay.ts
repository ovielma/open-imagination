import { useEffect } from "react";

export function useInViewAutoplay(
    ref: React.RefObject<HTMLVideoElement | null>,
    options: IntersectionObserverInit = { threshold: 0.5}
) {
    useEffect(() => {
        const elementObserved = ref.current;
        if (!elementObserved) return;
    
        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;
            if (entry.isIntersecting) {
                elementObserved.play().catch(() => {});
            } else {
                elementObserved.pause();
            }
        };
        // io = intersection observer
        const io = new IntersectionObserver(handleIntersection, options);
        io.observe(elementObserved);

        return () => io.disconnect();
    }, [ref, options]);
}
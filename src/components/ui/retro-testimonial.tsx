import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ===== Types and Interfaces =====
export interface iTestimonial {
    name: string;
    designation: string;
    description: string;
    profileImage: string;
}

interface iCarouselProps {
    items: React.ReactElement<{
        testimonial: iTestimonial;
        index: number;
        layout?: boolean;
        onCardClose: () => void;
    }>[];
    initialScroll?: number;
}

// ===== Custom Hooks =====
const useOutsideClick = (
    ref: React.RefObject<HTMLDivElement | null>,
    onOutsideClick: () => void,
) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            onOutsideClick();
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [ref, onOutsideClick]);
};

// ===== Components =====
const Carousel = ({ items, initialScroll = 0 }: iCarouselProps) => {
    const carouselRef = React.useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = React.useState(false);
    const [canScrollRight, setCanScrollRight] = React.useState(true);

    const checkScrollability = () => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
        }
    };

    const handleScrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const handleScrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    const handleCardClose = (index: number) => {
        if (carouselRef.current) {
            const cardWidth = isMobile() ? 230 : 384;
            const gap = isMobile() ? 4 : 8;
            const scrollPosition = (cardWidth + gap) * (index + 1);
            carouselRef.current.scrollTo({
                left: scrollPosition,
                behavior: "smooth",
            });
        }
    };

    const isMobile = () => {
        return window && window.innerWidth < 768;
    };

    useEffect(() => {
        if (carouselRef.current) {
            carouselRef.current.scrollLeft = initialScroll;
            checkScrollability();
        }
    }, [initialScroll]);

    return (
        <div className="relative w-full mt-10">
            <div
                className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth [scrollbar-width:none] py-5"
                ref={carouselRef}
                onScroll={checkScrollability}
            >
                <div
                    className={cn(
                        "absolute right-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-l",
                    )}
                />
                <div
                    className={cn(
                        "flex flex-row justify-start gap-4 pl-3",
                        "max-w-7xl mx-auto",
                    )}
                >
                    {items.map((item, index) => {
                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                    transition: {
                                        duration: 0.5,
                                        delay: 0.1 * Math.min(index, 5),
                                        ease: "easeOut",
                                    },
                                }}
                                viewport={{ once: true, amount: 0.1 }}
                                key={`card-${index}`}
                                className="last:pr-[5%] md:last:pr-[33%] rounded-3xl"
                            >
                                {React.cloneElement(item, {
                                    onCardClose: () => {
                                        return handleCardClose(index);
                                    },
                                })}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
            <div className="flex justify-end gap-2 mt-4 max-w-7xl mx-auto px-6">
                <button
                    className="relative z-40 h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center disabled:opacity-50 hover:bg-indigo-700 transition-colors duration-200 shadow-lg shadow-indigo-600/20"
                    onClick={handleScrollLeft}
                    disabled={!canScrollLeft}
                >
                    <ArrowLeft className="h-5 w-5 text-white" />
                </button>
                <button
                    className="relative z-40 h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center disabled:opacity-50 hover:bg-indigo-700 transition-colors duration-200 shadow-lg shadow-indigo-600/20"
                    onClick={handleScrollRight}
                    disabled={!canScrollRight}
                >
                    <ArrowRight className="h-5 w-5 text-white" />
                </button>
            </div>
        </div>
    );
};

const TestimonialCard = ({
    testimonial,
    index,
    layout = false,
    onCardClose = () => { },
    backgroundImage = "https://images.unsplash.com/photo-1686806372726-388d03ff49c8?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
}: {
    testimonial: iTestimonial;
    index: number;
    layout?: boolean;
    onCardClose?: () => void;
    backgroundImage?: string;
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleExpand = () => {
        return setIsExpanded(true);
    };
    const handleCollapse = () => {
        setIsExpanded(false);
        onCardClose();
    };

    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                handleCollapse();
            }
        };

        if (isExpanded) {
            const scrollY = window.scrollY;
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = "100%";
            document.body.style.overflow = "hidden";
            document.body.dataset.scrollY = scrollY.toString();
        } else {
            const scrollY = parseInt(document.body.dataset.scrollY || "0", 10);
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";
            document.body.style.overflow = "";
            window.scrollTo({ top: scrollY, behavior: "instant" });
        }

        window.addEventListener("keydown", handleEscapeKey);
        return () => {
            return window.removeEventListener("keydown", handleEscapeKey);
        };
    }, [isExpanded]);

    useOutsideClick(containerRef, handleCollapse);

    return (
        <>
            <AnimatePresence>
                {isExpanded && (
                    <div className="fixed inset-0 h-screen overflow-hidden z-50">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-background/80 backdrop-blur-lg h-full w-full fixed inset-0"
                        />
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            ref={containerRef}
                            layoutId={layout ? `card-${testimonial.name}` : undefined}
                            className="max-w-4xl mx-auto bg-card border border-border/50 shadow-2xl h-[90%] md:h-[80%] z-[60] p-6 md:p-12 rounded-3xl relative mt-[5%] overflow-y-auto"
                        >
                            <button
                                className="sticky top-0 h-10 w-10 right-0 ml-auto rounded-full flex items-center justify-center bg-secondary hover:bg-secondary/80 transition-colors z-50 text-foreground shadow-sm"
                                onClick={handleCollapse}
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <motion.p
                                layoutId={layout ? `category-${testimonial.name}` : undefined}
                                className="px-0 md:px-20 text-indigo-500 font-semibold tracking-widest uppercase text-sm mb-2"
                            >
                                {testimonial.designation}
                            </motion.p>
                            <motion.p
                                layoutId={layout ? `title-${testimonial.name}` : undefined}
                                className="px-0 md:px-20 text-3xl md:text-5xl font-extrabold text-foreground tracking-tight"
                            >
                                {testimonial.name}
                            </motion.p>
                            <div className="py-8 text-muted-foreground px-0 md:px-20 text-xl md:text-2xl font-medium leading-relaxed">
                                <Quote className="h-10 w-10 text-indigo-500/20 mb-4" />
                                "{testimonial.description}"
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <motion.button
                layoutId={layout ? `card-${testimonial.name}` : undefined}
                onClick={handleExpand}
                className="text-left"
                whileHover={{
                    rotateX: 2,
                    rotateY: 2,
                    rotate: 3,
                    scale: 1.02,
                    transition: { duration: 0.3, ease: "easeOut" },
                }}
            >
                <div
                    className={`${index % 2 === 0 ? "rotate-0" : "-rotate-0"} rounded-3xl bg-card border border-border/50 h-[400px] md:h-[450px] w-72 md:w-80 overflow-hidden flex flex-col items-center justify-center relative z-10 shadow-lg group`}
                >
                    <div className="absolute opacity-10 dark:opacity-5 transition-opacity duration-300 group-hover:opacity-20 dark:group-hover:opacity-10 pointer-events-none" style={{ inset: "-1px 0 0" }}>
                        <div className="absolute inset-0">
                            <img
                                className="block w-full h-full object-center object-cover"
                                src={backgroundImage}
                                alt="Background layer"
                            />
                        </div>
                    </div>
                    <ProfileImage src={testimonial.profileImage} alt={testimonial.name} />
                    <motion.p
                        layoutId={layout ? `title-${testimonial.name}` : undefined}
                        className="text-foreground text-sm md:text-base font-medium text-center text-balance mt-6 px-6 leading-relaxed"
                    >
                        "{testimonial.description.length > 90
                            ? `${testimonial.description.slice(0, 90)}...`
                            : testimonial.description}"
                    </motion.p>
                    <motion.p
                        layoutId={layout ? `category-${testimonial.name}` : undefined}
                        className="text-foreground text-base md:text-lg font-bold text-center mt-6"
                    >
                        {testimonial.name}
                    </motion.p>
                    <motion.p
                        layoutId={layout ? `category-${testimonial.name}` : undefined}
                        className="text-indigo-500 text-xs md:text-sm font-semibold text-center mt-1"
                    >
                        {testimonial.designation.length > 35
                            ? `${testimonial.designation.slice(0, 35)}...`
                            : testimonial.designation}
                    </motion.p>
                </div>
            </motion.button>
        </>
    );
};

const ProfileImage = ({ src, alt, ...rest }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const [isLoading, setLoading] = useState(true);

    return (
        <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] overflow-hidden rounded-[1000px] border-4 border-background shadow-xl flex-none relative z-20 bg-muted">
            <img
                className={cn(
                    "transition-all duration-500 absolute top-0 inset-0 rounded-inherit object-cover z-50 w-full h-full",
                    isLoading ? "blur-sm scale-110" : "blur-0 scale-100",
                )}
                onLoad={() => {
                    return setLoading(false);
                }}
                src={src}
                loading="lazy"
                decoding="async"
                alt={alt || "Profile image"}
                {...rest}
            />
        </div>
    );
};

export { Carousel, TestimonialCard, ProfileImage };

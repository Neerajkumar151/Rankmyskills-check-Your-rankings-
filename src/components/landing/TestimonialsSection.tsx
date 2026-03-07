import { motion } from 'framer-motion';
import { Carousel, TestimonialCard, type iTestimonial } from '@/components/ui/retro-testimonial';

type TestimonialDetails = {
    [key: string]: iTestimonial & { id: string };
};

const testimonialData = {
    ids: [
        "user-1", "user-2", "user-3", "user-4", "user-5", "user-6"
    ],
    details: {
        "user-1": {
            id: "user-1",
            description: "RankMySkills completely changed how I prepare for placements. Having my CodeChef, LeetCode, and GFG stats all in one dashboard saves me so much time. The global ranking pushes me to solve more problems daily.",
            profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
            name: "Rohan Gupta",
            designation: "Final Year, B.Tech CSE (IIT Delhi)",
        },
        "user-2": {
            id: "user-2",
            description: "As a student coordinator, tracking the coding progress of my juniors used to be a nightmare of spreadsheets. Now, the College Leaderboard does it automatically. It's built perfectly for Indian engineering colleges.",
            profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
            name: "Ananya Desai",
            designation: "Coding Club Lead (NIT Trichy)",
        },
        "user-3": {
            id: "user-3",
            description: "The UI is just incredibly smooth and premium. It feels like using an Apple product but for competitive programming. I use the portfolio link directly on my resume now instead of pasting four different platform links.",
            profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
            name: "Vikram Singh",
            designation: "SDE-1 at Amazon",
        },
        "user-4": {
            id: "user-4",
            description: "I love the scoring formula. It accurately balances my high Codeforces rating with my high volume of problems solved on GeeksforGeeks. It gives a very true representation of a developer's actual skill level.",
            profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
            name: "Priya Patel",
            designation: "3rd Year, IT (VIT Vellore)",
        },
        "user-5": {
            id: "user-5",
            description: "This is easily the best competitive programming tracker I've used. The automated sync is flawless, and the dark mode is gorgeous. All my friends in college are using it to compete against each other.",
            profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
            name: "Aarav Sharma",
            designation: "2nd Year, CSE (BITS Pilani)",
        },
        "user-6": {
            id: "user-6",
            description: "The 1-click registration made onboarding so easy. It pulls everything instantly. Instead of stressing about individual contests, I now focus on my overall Global Engineer Score. Highly recommended for every tech student.",
            profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
            name: "Neha Reddy",
            designation: "Pre-final Year (IIIT Hyderabad)",
        },
    },
};

export const TestimonialsSection = () => {
    // Generate the cards from the data
    const cards = testimonialData.ids.map((cardId: string, index: number) => {
        const details = testimonialData.details as TestimonialDetails;
        return (
            <TestimonialCard
                key={cardId}
                testimonial={details[cardId]}
                index={index}
                backgroundImage="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=3129&auto=format&fit=crop"
            />
        );
    });

    return (
        <section className="py-28 md:py-36 relative overflow-hidden bg-secondary/10 border-y border-border/50">
            <div className="absolute inset-0 bg-secondary/30 dark:bg-secondary/15 pointer-events-none" />

            <div className="relative z-10">
                <motion.div
                    className="text-center mb-8 px-6 max-w-7xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <p className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-4">Community</p>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-5 tracking-[-0.02em]">Built for students.</h2>
                    <p className="text-muted-foreground text-lg text-balance max-w-lg mx-auto">
                        See how top engineering students across India are using RankMySkills to hack their career growth.
                    </p>
                </motion.div>

                <Carousel items={cards} />
            </div>
        </section>
    );
};

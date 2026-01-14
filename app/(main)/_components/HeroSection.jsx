"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

const HeroSection = () => {
    return (
        <section className="relative overflow-hidden">
            {/* Background Gradient Glow */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-blue-400/20 blur-3xl -z-10" />

            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.15 },
                    },
                }}
                className="flex flex-col items-center text-center px-6 py-24 max-w-6xl mx-auto"
            >
                {/* Badge */}
                <motion.span
                    variants={{
                        hidden: { opacity: 0, y: -20 },
                        visible: { opacity: 1, y: 0 },
                    }}
                    className="mb-6 rounded-full border border-blue-200 bg-blue-50 px-5 py-1.5 text-sm font-medium"
                >
                    VoxNova • AI Voice Agent
                </motion.span>

                {/* Heading */}
                <motion.h1
                    variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: { opacity: 1, y: 0 },
                    }}
                    className="text-4xl md:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight"
                >
                    Revolutionize Learning with{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        AI-Powered Voice Agents
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                    }}
                    className="mt-6 max-w-2xl text-gray-600 text-lg md:text-xl leading-relaxed"
                >
                    Experience interactive, real-time AI coaching with voice-enabled experts
                    designed to help you learn faster, smarter, and more confidently.
                </motion.p>

                {/* CTA */}
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                    }}
                    className="mt-10"
                >
                    <Link href="/dashboard">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button className="px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer">
                                Get Started Free
                            </Button>
                        </motion.div>
                    </Link>
                </motion.div>

                {/* Trust Text */}
                <motion.p
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1 },
                    }}
                    className="mt-4 text-sm text-gray-500"
                >
                    No credit card required • Instant access
                </motion.p>

                {/* Preview Image */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{
                        opacity: 1,
                        y: [0, -10, 0],
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                    }}
                    className="relative mt-20"
                >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 blur-2xl opacity-20 -z-10" />

                    <div className="shadow-2xl rounded-2xl overflow-hidden border">
                        <Image
                            src="/landingpage.png"
                            alt="VoxNova Dashboard Preview"
                            width={600}
                            height={160}
                            className="object-cover"
                            priority
                        />
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HeroSection;

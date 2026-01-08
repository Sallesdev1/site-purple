import { ArrowRightIcon } from 'lucide-react';
import { GhostButton } from './Buttons';
import { motion } from 'framer-motion';

export default function CTA() {
    return (
        <section className="py-20 2xl:pb-32 px-4">
            <div className="container mx-auto max-w-3xl">
                <div className="rounded-3xl bg-linear-to-b from-violet-900/20 to-violet-900/5 border border-violet-500/20 p-12 md:p-16 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20" />
                    <div className="relative z-10">
                        <motion.h2 className="text-2xl sm:text-4xl font-semibold mb-6"
                            initial={{ y: 60, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
                        >
                            Marketing bom dá trabalho!
                        </motion.h2>
                        <motion.p className="max-sm:text-sm text-slate-400 mb-10 max-w-xl mx-auto"
                            initial={{ y: 60, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.2 }}
                        >
                            Sorte sua que ele é todo nosso! Conte com um braço a mais para compor o seu time ou joga tudo na nossa mão. Você que decide!
                        </motion.p>
                        <motion.div
                            initial={{ y: 60, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.3 }}
                        >
                            <GhostButton className="px-8 py-3 gap-2">
                                Quero resolver meu marketing agora!! <ArrowRightIcon size={20} />
                            </GhostButton>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
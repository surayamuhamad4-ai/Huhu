"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GIRLFRIEND_NAME } from "@/lib/data";
import { useLoveStore } from "@/lib/store";

const LETTER_PARAGRAPHS: string[] = [
  "亲爱的 Megan boo yin ern：",
  "如果有人问我，这个世界上最美的风景是什么，我会毫不犹豫地回答——是你的笑容。",
  "第一次认真看着你的时候，我才明白，原来一个人的美貌真的可以让时间慢下来。你的眼睛像清晨最温柔的光，你的笑容像春天吹来的微风，每一次与你对视，我都会不由自主地心跳加速。考试时，我们偶尔交换一个眼神，你轻轻一笑，那一刻，比任何满分都更加珍贵。",
  "我最怀念的，不只是那些重要的日子，而是我们一起坐在你的书桌前学习的时光。能够陪伴你、教你做题、一起思考、一起努力，那些平凡的瞬间，在我的心里却成了最美好的回忆。看着你认真学习的模样，我总会觉得，原来幸福可以如此简单。",
  "你的善良，是我最欣赏的地方。你总是温柔地对待身边的人，也总能用真诚感染别人。你的可爱，不只是笑起来的时候，更是在你认真、害羞、开心、甚至偶尔有点小迷糊的时候。正是这些点点滴滴，让我越来越喜欢你，也让我越来越确定，你就是那个我希望陪伴一生的人。",
  "我不知道未来会发生什么，也不知道我们还会经历多少挑战，但我知道一件事——如果未来能够牵着你的手，一起面对生活中的每一天，那会是我最大的幸运。",
  "Megan boo yin ern，谢谢你出现在我的生命里。因为有了你，我开始期待明天，期待未来，也期待属于我们的故事。",
  "如果有一天，你愿意穿上洁白的婚纱，而我能够站在你的身旁，我会把那一天当作我生命中最幸福的时刻。我想娶你，不只是因为你的美丽，更因为你的善良、你的可爱、你的坚强，以及那个独一无二的你。",
  "无论岁月如何流转，我都会珍惜与你相遇的每一天。",
  "愿未来的每一个春夏秋冬，我们都能一起走过。",
];

export default function LoveLetter() {
  const [isOpen, setIsOpen] = useState(false);
  const incrementLoveMeter = useLoveStore((s) => s.incrementLoveMeter);

  function handleOpen() {
    setIsOpen(true);
    incrementLoveMeter(8);
  }

  return (
    <section id="letter" className="relative w-full flex flex-col items-center justify-center px-6 py-24 min-h-screen" aria-label="Love letter">
      <h2 className="font-display text-4xl md:text-5xl text-cream mb-12 text-center">Open When You&rsquo;re Ready</h2>
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="envelope"
            type="button"
            onClick={handleOpen}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            whileHover={{ scale: 1.03, rotate: -1 }}
            whileTap={{ scale: 0.97 }}
            className="group relative w-full max-w-md aspect-[3/2] rounded-2xl bg-gradient-to-br from-rose-gold to-sakura shadow-xl shadow-sakura/20 flex items-center justify-center border border-sakura/30"
            aria-label="Open the sealed letter"
          >
            <div className="relative z-10 flex flex-col items-center gap-3">
              <span className="text-5xl group-hover:scale-110 transition-transform">💌</span>
              <span className="font-hand text-2xl text-plum">tap to open</span>
            </div>
          </motion.button>
        ) : (
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="glass-card w-full max-w-2xl px-6 py-10 md:px-12 md:py-14"
          >
            <p className="text-center font-hand text-xl text-sakura mb-6">{GIRLFRIEND_NAME}</p>
            <div className="space-y-5 font-body leading-relaxed text-[1.05rem] md:text-lg text-cream/90">
              {LETTER_PARAGRAPHS.map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 * i, duration: 0.6 }}
                  className={i === 0 ? "font-display text-xl text-sakura-light" : ""}
                  lang="zh"
                >
                  {para}
                </motion.p>
              ))}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 * LETTER_PARAGRAPHS.length + 0.3 }}
                className="font-hand text-2xl text-rose-gold text-right pt-4"
              >
                永远爱你的，Aidil
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

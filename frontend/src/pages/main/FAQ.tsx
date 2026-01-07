import type { FC } from 'react';

export const FAQ: FC = () => {
  const FAQItems = [
    {
      question: 'What are the different Breathing Techniques in Demon Slayer?',
      answer:
        'There are multiple Breathing Techniques used by demon slayers, each with unique forms and abilities. The main ones include Water Breathing (used by Giyu and Tanjiro), Flame Breathing (Rengoku), Thunder Breathing (Zenitsu), Wind Breathing (Sanemi), Stone Breathing (Gyomei), Mist Breathing (Muichiro), Love Breathing (Mitsuri), Serpent Breathing (Obanai), Sound Breathing (Tengen), and Insect Breathing (Shinobu). Each technique has specific forms and can be adapted by skilled users.'
    },
    {
      question: 'Who are the Hashira and how many are there?',
      answer:
        'The Hashira are the nine most elite demon slayers in the Demon Slayer Corps, each representing a pillar of strength. They are: Giyu Tomioka (Water Hashira), Shinobu Kocho (Insect Hashira), Kyojuro Rengoku (Flame Hashira), Tengen Uzui (Sound Hashira), Mitsuri Kanroji (Love Hashira), Obanai Iguro (Serpent Hashira), Sanemi Shinazugawa (Wind Hashira), Gyomei Himejima (Stone Hashira), and Muichiro Tokito (Mist Hashira). They are the strongest warriors and serve as leaders in the fight against demons.'
    },
    {
      question: 'Why does Nezuko not eat humans like other demons?',
      answer:
        'Nezuko Kamado is unique among demons because she retains her human consciousness and memories. After being turned into a demon by Muzan Kibutsuji, she made a conscious decision to never harm humans, especially after seeing her family killed. Her strong willpower and the bamboo muzzle help her resist her demonic urges. Additionally, she sleeps instead of eating, which is extremely unusual for demons.'
    },
    {
      question: 'What are the Upper Moons and Lower Moons?',
      answer:
        'The Twelve Kizuki (Twelve Demon Moons) are the most powerful demons under Muzan Kibutsuji, divided into Upper Moons (Upper Ranks 1-6) and Lower Moons (Lower Ranks 1-6). The Upper Moons are incredibly powerful, with Upper Moon 1 (Kokushibo) being the strongest. The Lower Moons are weaker and can be replaced if they fail. Each Upper Moon possesses unique Blood Demon Arts and represents an extreme threat even to Hashira-level demon slayers.'
    },
    {
      question: 'How does Tanjiro\'s sense of smell help him in battle?',
      answer:
        'Tanjiro possesses an extraordinary sense of smell that allows him to detect emotions, intentions, weaknesses, and even predict enemy movements. He can smell the "opening thread" - a visual representation of weak points in his opponents. This ability, combined with his Water Breathing and later Sun Breathing techniques, makes him an exceptional demon slayer despite starting his training relatively late.'
    },
    {
      question: 'What is a Nichirin Blade and why is it important?',
      answer:
        'Nichirin Blades are special swords forged from Scarlet Crimson Iron Sand and Scarlet Crimson Ore, which absorb sunlight. These are the only weapons capable of permanently killing demons (along with direct sunlight). When a demon slayer first receives their blade, it changes color based on their breathing technique and personality. For example, Tanjiro\'s blade turns black, which is extremely rare and indicates great potential.'
    },
    {
      question: 'Can demons be cured and turned back into humans?',
      answer:
        'In the Demon Slayer universe, turning a demon back into a human is extremely difficult and was thought to be impossible. However, Nezuko\'s case shows it might be possible with the right treatment. The main methods to eliminate demons are: decapitation with a Nichirin Blade, exposure to direct sunlight, or injection of wisteria poison (used by Shinobu). The search for a cure is a central theme in Tanjiro\'s journey.'
    },
    {
      question: 'What is the Demon Slayer Corps and how do you join?',
      answer:
        'The Demon Slayer Corps is a secret organization dedicated to protecting humanity from demons. To join, one must pass the Final Selection - a dangerous test where candidates must survive seven days on a mountain filled with demons. Only those who survive receive a Nichirin Blade and become official demon slayers. The Corps operates in secret to avoid public panic and is led by Kagaya Ubuyashiki.'
    }
  ];

  return (
    <section id="faq" className="faq">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Frequently Asked Questions</h2>
          <p>
            Have questions about Demon Slayer: Kimetsu no Yaiba? Find answers to common questions
            about breathing techniques, Hashira, demons, and the Demon Slayer Corps. Whether you're
            a new fan or a seasoned demon slayer, these FAQs will help you understand the world of Demon Slayer.
          </p>
        </div>

        <div className="faq-list">
          <ul>
            {FAQItems.map((item, idx) => (
              <li
                data-aos="fade-up"
                data-aos-delay={100 * idx}
                key={`faq-item-${idx}`}
              >
                <i className="bx bx-help-circle icon-help" />{' '}
                <a
                  data-toggle="collapse"
                  className={idx === 0 ? 'collapse' : 'collapsed'}
                  href={`#faq-list-${idx}`}
                >
                  {item.question}
                  <i className="bx bx-chevron-down icon-show" />
                  <i className="bx bx-chevron-up icon-close" />
                </a>
                <div
                  id={`faq-list-${idx}`}
                  className={`collapse ${idx === 0 && 'show'}`}
                  data-parent=".faq-list"
                >
                  <p>{item.answer}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

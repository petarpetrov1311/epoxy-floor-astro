import React from 'react';

const specs = [
  { label: 'Якост на натиск', value: '55 N/mm²' },
  { label: 'Якост на огъване', value: '35 N/mm²' },
  { label: 'Износоустойчивост', value: '2.4 cm²/50 cm²' },
  { label: 'Коефициент на топлопроводимост', value: '40 x 10⁻⁶/°C' },
  { label: 'Пожарна класификация', value: 'M2 (F), 5.2 (CH), B1' },
];

export default function EpoxyInfo() {

  return (
    <section className="py-10 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Text */}
          <div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3">
              Какво представляват<br />епоксидните настилки?
            </h2>
            <div className="w-14 h-1 bg-primary mb-4 md:mb-6" />
            <p className="text-muted-foreground leading-relaxed mb-4 text-sm md:text-base">
              Когато става въпрос за избор на подови настилки за промишлена употреба, гараж или 
              други повърхности, епоксидните подове се явяват едно от най-добрите решения. 
              Епоксидните подове са много <strong className="text-foreground">издръжливи, приспособими и устойчиви</strong>, 
              ето защо са все по-предпочитан избор.
            </p>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base hidden md:block">
              Пакетът от продукти на EPOXY FLOORS дава възможност за съобразяване 
              със спецификата на дейността на всеки клиент. В едно предприятие могат да бъдат 
              приложени <strong className="text-foreground">повече от една система</strong>, съобразно използването 
              на различните помещения.
            </p>
          </div>

          {/* Specs Table */}
          <div>
            <div className="bg-muted/30 rounded-lg overflow-hidden border border-border">
              <div className="bg-navy px-6 py-4">
                <h3 className="text-white font-bold">Технически показатели</h3>
              </div>
              <table className="w-full">
                <tbody>
                  {specs.map((spec, i) => (
                    <tr
                      key={spec.label}
                      className={`border-b border-border ${i % 2 === 0 ? 'bg-white' : 'bg-muted/20'}`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{spec.label}</td>
                      <td className="px-6 py-4 text-sm text-primary font-bold text-right">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-5 bg-primary/8 border border-primary/20 rounded-lg">
              <p className="text-sm text-foreground font-semibold mb-2">Гаранционен период</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Висококачествените немски материали и тяхното правилно полагане ни дават 
                основание да предлагаме гаранционен период <strong>между 5 и 10 години</strong> в 
                зависимост от избраните продукти.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
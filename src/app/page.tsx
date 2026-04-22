import { DossierStage } from '@/components/DossierStage';
import { Spread0 } from '@/components/spreads/Spread0';
import { Spread1 } from '@/components/spreads/Spread1';
import { Spread2 } from '@/components/spreads/Spread2';
import { Spread3 } from '@/components/spreads/Spread3';
import { Spread4 } from '@/components/spreads/Spread4';
import { Spread5 } from '@/components/spreads/Spread5';
import { Spread6 } from '@/components/spreads/Spread6';

export default function Page() {
  const spreads = [
    <Spread0 key="0" />,
    <Spread1 key="1" />,
    <Spread2 key="2" />,
    <Spread3 key="3" />,
    <Spread4 key="4" />,
    <Spread5 key="5" />,
    <Spread6 key="6" />
  ];
  const labels = [
    'Порог',
    'Обложка',
    'Манифест',
    'Два проекта в год',
    'Процесс',
    'Избранные работы',
    'Контакт'
  ];
  return <DossierStage spreads={spreads} spreadLabels={labels} />;
}

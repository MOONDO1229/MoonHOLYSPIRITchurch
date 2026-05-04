import PageHeader from '@/components/PageHeader';
import { Heart, CreditCard, Info } from 'lucide-react';
import { getSettings } from '@/lib/db';
import CopyButton from '@/components/CopyButton';

export default async function SupportPage() {
  const settings = await getSettings();
  const accountNum = "351-1075-3818-33";

  return (
    <main>
      <PageHeader title="온라인 헌금 안내" subtitle="드려진 헌금은 하나님 나라 확장과 이웃 사랑을 위해 소중하게 사용됩니다." />

      <section className="container section">
        <div className="support-container">
          <div className="account-card">
            <div className="card-icon"><Heart size={48} color="var(--primary-color)" /></div>
            <h2>정성껏 준비한 헌금</h2>
            
            <div className="bank-info">
              <span className="bank-label">농협 (NH)</span>
              <div className="account-number" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: '800' }}>{accountNum}</span>
                <CopyButton text={accountNum} />
              </div>
              <p className="account-holder">예금주: 성령교회</p>
            </div>

            <div className="offering-guide">
              <div className="guide-item">
                <Info size={20} />
                <p>송금 시 <strong>"성함+헌금종류"</strong>를 입력해 주세요. (예: 홍길동십일조, 김철수감사)</p>
              </div>
            </div>
          </div>

          <div className="support-info-grid">
            <div className="info-box">
              <h3>헌금 종류 안내</h3>
              <ul>
                <li><strong>십일조:</strong> 소득의 1/10을 드리는 신앙의 고백</li>
                <li><strong>주일헌금:</strong> 매주 주일 예배 시 드리는 감사의 헌금</li>
                <li><strong>감사헌금:</strong> 범사에 감사하는 마음으로 드리는 헌금</li>
                <li><strong>선교/구제헌금:</strong> 선교와 어려운 이웃을 위해 드리는 헌금</li>
              </ul>
            </div>
            <div className="info-box">
              <h3>기부금 영수증 안내</h3>
              <p>연말정산을 위한 기부금 영수증 발급이 필요하신 분은 교회 사무실로 문의해 주시기 바랍니다.</p>
              <p className="contact">📞 031-766-8847</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

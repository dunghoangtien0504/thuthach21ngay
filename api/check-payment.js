export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { phone, email, product } = req.query;
  if (!phone && !email) {
    return res.status(400).json({ error: 'Missing phone or email query parameter' });
  }

  const token = process.env.SEPAY_API_KEY;
  if (!token) {
    console.warn('SEPAY_API_KEY environment variable is not configured.');
    return res.status(200).json({
      success: false,
      message: 'SEPAY_API_KEY is not configured on the server. Please add it to your Vercel Environment Variables.'
    });
  }

  // Product-specific thresholds and program codes
  const isKegel = product === 'kegel';
  const minAmount = isKegel ? 195000 : 680000;
  const maxAmount = isKegel ? 650000 : Infinity;
  const programCodes = isKegel ? ['kegel', 'kg21'] : ['ma21', 'matma21'];

  try {
    const response = await fetch('https://userapi.sepay.vn/v2/transactions?limit=50', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`SePay API returned status ${response.status}`);
    }

    const data = await response.json();
    const transactions = data.transactions || [];

    const cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : '';
    const cleanEmail = email ? email.trim().toLowerCase() : '';

    const matched = transactions.find(t => {
      if (t.transfer_type !== 'in') return false;

      const amount = parseFloat(t.transfer_amount || t.amount || 0);
      if (amount < minAmount || amount > maxAmount) return false;

      const memo = (t.transaction_content || t.content || '').toLowerCase();

      const hasPhoneMatch = cleanPhone && cleanPhone.length >= 9 && memo.includes(cleanPhone);
      const emailPrefix = cleanEmail ? cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') : '';
      const hasEmailMatch = emailPrefix && emailPrefix.length >= 3 && memo.includes(emailPrefix);
      const hasProgramCode = programCodes.some(code => memo.includes(code));

      return (hasPhoneMatch || hasEmailMatch || (hasProgramCode && (memo.includes(cleanPhone) || memo.includes(emailPrefix))));
    });

    if (matched) {
      return res.status(200).json({
        success: true,
        transaction: {
          id: matched.id,
          amount: matched.transfer_amount || matched.amount,
          date: matched.transaction_date || matched.transactionDate,
          content: matched.transaction_content || matched.content
        }
      });
    }

    return res.status(200).json({ success: false });

  } catch (error) {
    console.error('Error checking payment:', error);
    return res.status(500).json({ error: error.message });
  }
}

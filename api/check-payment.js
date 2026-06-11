export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { phone, email } = req.query;

  if (!phone && !email) {
    return res.status(400).json({ error: 'Missing phone or email query parameter' });
  }

  const token = process.env.SEPAY_API_KEY;
  if (!token) {
    console.warn("SEPAY_API_KEY environment variable is not configured.");
    return res.status(200).json({ 
      success: false, 
      message: 'SEPAY_API_KEY is not configured on the server. Please add it to your Vercel Environment Variables.' 
    });
  }

  try {
    // Fetch latest 50 transactions from SePay API v2
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

    // Search for a matching transaction
    const matched = transactions.find(t => {
      // Must be incoming transaction
      if (t.transfer_type !== 'in') return false;

      // Verify amount (standard is 686.868đ, we check for >= 680.000đ to allow minor differences)
      const amount = parseFloat(t.transfer_amount || t.amount || 0);
      if (amount < 680000) return false;

      const memo = (t.transaction_content || t.content || '').toLowerCase();

      // Match by phone number or email first part
      const hasPhoneMatch = cleanPhone && cleanPhone.length >= 9 && memo.includes(cleanPhone);
      const emailPrefix = cleanEmail ? cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') : '';
      const hasEmailMatch = emailPrefix && emailPrefix.length >= 3 && memo.includes(emailPrefix);

      // Verify it has the program prefix 'ma21' or 'matma21'
      const hasProgramCode = memo.includes('ma21') || memo.includes('matma21');

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

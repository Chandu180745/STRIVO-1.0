import jsPDF from 'jspdf';

export const generatePDF = (title: string, sections: { heading: string; content: string }[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let y = 20;

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(title, margin, y);
  y += 10;

  // Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, y);
  y += 10;

  // Line separator
  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  sections.forEach(section => {
    // Check for page break
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    // Section heading
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(section.heading, margin, y);
    y += 8;

    // Section content
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(section.content, maxWidth);
    lines.forEach((line: string) => {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += 5;
    });

    y += 8;
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`STRIVO FITNESS — Page ${i} of ${pageCount}`, margin, 290);
  }

  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};

export const exportHealthReport = (data: {
  steps: number;
  calories: number;
  water: number;
  activeMinutes: number;
  sleepHours: number;
  heartRate: number;
  bmi?: number;
  bmiCategory?: string;
}) => {
  generatePDF('Health Report — STRIVO', [
    { heading: 'Daily Metrics', content: `Steps: ${data.steps}\nCalories Burned: ${data.calories} kcal\nWater Intake: ${data.water} glasses\nActive Minutes: ${data.activeMinutes} min\nSleep: ${data.sleepHours} hours\nHeart Rate: ${data.heartRate} bpm` },
    ...(data.bmi ? [{ heading: 'BMI Analysis', content: `BMI: ${data.bmi.toFixed(1)}\nCategory: ${data.bmiCategory}` }] : []),
    { heading: 'Recommendations', content: 'Based on your data, maintain consistent activity levels. Stay hydrated with 8+ glasses of water daily. Aim for 7-9 hours of quality sleep.' },
  ]);
};

export const exportMealPlan = (days: { day: string; meals: string }[]) => {
  generatePDF('Weekly Meal Plan — STRIVO', days.map(d => ({
    heading: d.day,
    content: d.meals,
  })));
};

export const exportComparisonReport = (products: { name: string; price: number; category: string; description: string; tags?: string[] }[]) => {
  generatePDF('Product Comparison — STRIVO', [
    ...products.map(p => ({
      heading: p.name,
      content: `Price: ₹${p.price.toLocaleString()}\nCategory: ${p.category}\nDescription: ${p.description}\nTags: ${p.tags?.join(', ') || 'None'}`,
    })),
    { heading: 'Summary', content: `Compared ${products.length} products. Check individual product pages for detailed nutritional information and usage instructions.` },
  ]);
};

export const exportOrderHistory = (orders: { id: string; date: string; total: number; items: string; status: string }[]) => {
  generatePDF('Order History — STRIVO', orders.map(o => ({
    heading: `Order ${o.id.slice(0, 8).toUpperCase()}`,
    content: `Date: ${o.date}\nTotal: ₹${o.total.toLocaleString()}\nItems: ${o.items}\nStatus: ${o.status}`,
  })));
};

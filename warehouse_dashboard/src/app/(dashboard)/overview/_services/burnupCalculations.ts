export interface BurnupResult {
  months: string[];
  targetLine: number[];
  actualCumulative: (number | null)[];
  forecastLine: (number | null)[];
  forecastTotal: number;
}

export function calculateBurnupTrajectory(actual: number, target: number): BurnupResult {
  const months = ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'];

  // เส้นเป้าหมายเชิงเส้น (Linear Target Trajectory)
  const targetLine = months.map((_, idx) => Number(((target / 12) * (idx + 1)).toFixed(2)));

  // ข้อมูลจริงสะสม
  const actualCumulative = [
    actual * 0.12,
    actual * 0.25,
    actual * 0.42,
    actual * 0.58,
    actual * 0.76,
    actual * 0.92,
    actual,
    null,
    null,
    null,
    null,
    null,
  ];

  // คาดการณ์แนวโน้มสิ้นปี (Run-rate forecast)
  const currentVelocity = actual / 7;
  const forecastLine: (number | null)[] = [null, null, null, null, null, null, actual];
  for (let i = 7; i < 12; i++) {
    forecastLine.push(Number((actual + currentVelocity * (i - 6)).toFixed(2)));
  }

  return {
    months,
    targetLine,
    actualCumulative,
    forecastLine,
    forecastTotal: actual + currentVelocity * 5,
  };
}

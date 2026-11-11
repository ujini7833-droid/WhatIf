const DATE_ONLY_PATTERN = /^(\d{4})[.-](\d{2})[.-](\d{2})$/;

export const formatKoreanDate = (date?: string) => {
  if (!date) return '';

  const dateOnlyMatch = date.match(DATE_ONLY_PATTERN);
  if (dateOnlyMatch) return `${dateOnlyMatch[1]}.${dateOnlyMatch[2]}.${dateOnlyMatch[3]}`;

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return '';

  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(parsedDate).replaceAll('-', '.');
};

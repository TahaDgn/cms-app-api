export const isValidJsonString = (item: string) => {
  if (typeof item !== 'string') return false;

  item = item.trim();
  const regex = /^[\],:{}\s]*$/;

  return regex.test(
    item
      .replace(/\\["\\\/bfnrtu]/g, '@')
      .replace(
        /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
        ']',
      )
      .replace(/(?:^|:|,)(?:\s*\[)+/g, ''),
  );
};

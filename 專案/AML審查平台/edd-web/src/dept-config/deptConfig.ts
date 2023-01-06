function deptSectionData () {
  const json = require.context(
    "./",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  );
  const dept = {};
  json.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const amlKey = matched[1];
      dept[amlKey] = json(key);
    }
  });
  return dept;
}

export default { deptSectionData : deptSectionData() };
// https://github.com/lineupjs/lineup_app/blob/4279772b88f8dd893e8c5f56badb0fc00e3f716e/src/data/loader_dump.ts#L22

export function fromDumpFile(parsed: any) {
  parsed["data"].id = parsed["data"].name;
  parsed["data"].creationDate = new Date(parsed["data"].creationDate);
  if (parsed["data"].sessions) {
    parsed["data"].sessions.forEach((d: any) => d.creationDate = new Date(d.creationDate));
  }
  return parsed;
}

export function exportDump(dataset, lineup) {
  const dump = {};
  dump["data"] = Object.assign(dataset);
  delete dump["data"].build;
  delete dump["data"].buildScript;
  delete dump["data"].id;
  dump["data"].sessions = !dump["data"].sessions ? [] : dump["data"].sessions.map((d) => {
    const r = Object.assign({}, d);
    delete r.uid;
    delete r.dataset;
    return r;
  });
  dump["dump"] = lineup.dump();
  return dump;
}
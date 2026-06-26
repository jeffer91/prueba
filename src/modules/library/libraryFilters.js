function normalizeText(value) {
  return String(value || '').trim();
}

function buildAnalysisFilters(payload = {}) {
  const filters = {};
  const creatorName = normalizeText(payload.creatorName || payload.creator_name);
  const styleName = normalizeText(payload.styleName || payload.style_name);
  const status = normalizeText(payload.status);

  if (creatorName) filters.creator_name = creatorName;
  if (styleName) filters.style_name = styleName;
  if (status) filters.status = status;

  return filters;
}

function buildVideoFilters(payload = {}) {
  const filters = {};
  const creatorName = normalizeText(payload.creatorName || payload.creator_name);
  const styleName = normalizeText(payload.styleName || payload.style_name);
  const topic = normalizeText(payload.topic);
  const status = normalizeText(payload.status);

  if (creatorName) filters.creator_name = creatorName;
  if (styleName) filters.style_name = styleName;
  if (topic) filters.topic = topic;
  if (status) filters.status = status;

  return filters;
}

module.exports = {
  buildAnalysisFilters,
  buildVideoFilters
};

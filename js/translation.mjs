const textArea = document.getElementById("textarea");

const startTranslation = async (_sourceLanguage, _targetLanguage) => {
  try {
    if (_targetLanguage === _sourceLanguage) return;
    if (_sourceLanguage !== "en" && _targetLanguage !== "en") {
      await changeSourceToEnglish(_sourceLanguage, _targetLanguage);
      return;
    }
    const languagePair = {
      sourceLanguage: _sourceLanguage,
      targetLanguage: _targetLanguage,
    };
    if ("translation" in self && "createTranslator" in self.translation) {
      const translator = await self.translation.createTranslator(languagePair);
      const text = await translator.translate(textArea.value);
      textArea.value = text;
      textArea.dataset.language = _targetLanguage;
    }
  } catch (e) {
    console.error(e);
  }
};

const changeSourceToEnglish = async (_sourceLanguage, _targetLanguage) => {
  await startTranslation(_sourceLanguage, "en");
  await startTranslation("en", _targetLanguage);
};

export default startTranslation;

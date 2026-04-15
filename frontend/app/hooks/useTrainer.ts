// frontend/app/hooks/useTrainer.ts
import { useState, useCallback } from 'react';
import { getRandomWord, submitAnswer } from '../utils/api';
import { Word, AnswerResponse } from '../types';

export const useTrainer = (sessionId: string, onAnswer: () => void) => {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<AnswerResponse | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [mode, setMode] = useState<'random' | 'weak'>('random');
  const [selectedRule, setSelectedRule] = useState<string | null>(null);

  const loadWord = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    setSelectedAnswer(null);
    try {
      const word = await getRandomWord(sessionId, mode, selectedRule || undefined);
      setCurrentWord(word);
    } catch (error) {
      console.error('Failed to load word:', error);
    } finally {
      setLoading(false);
    }
  }, [sessionId, mode, selectedRule]);

  const checkAnswer = async (answer: string) => {
    if (!currentWord || selectedAnswer) return;

    setSelectedAnswer(answer);
    setLoading(true);

    try {
      const result = await submitAnswer(sessionId, currentWord.id, answer);
      setFeedback(result);
      onAnswer(); // Обновляем статистику
      
      // Автоматически загружаем следующее слово через 1.5 секунды
      setTimeout(() => {
        loadWord();
      }, 1500);
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeMode = (newMode: 'random' | 'weak') => {
    setMode(newMode);
    setSelectedRule(null);
    loadWord();
  };

  const changeRule = (rule: string | null) => {
    setSelectedRule(rule);
    setMode('random');
    loadWord();
  };

  return {
    currentWord,
    loading,
    feedback,
    selectedAnswer,
    mode,
    selectedRule,
    checkAnswer,
    loadWord,
    changeMode,
    changeRule,
  };
};
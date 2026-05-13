import React, { createContext, useState, useContext, useEffect } from 'react';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [activeJobs, setActiveJobs] = useState({});

  // Restaura jobs do localStorage ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem('activeJobs');
    if (saved) {
      setActiveJobs(JSON.parse(saved));
    }
  }, []);

  // Persiste jobs no localStorage
  useEffect(() => {
    localStorage.setItem('activeJobs', JSON.stringify(activeJobs));
  }, [activeJobs]);

  const registerJob = (jobId, tipo, parametros) => {
    setActiveJobs(prev => ({
      ...prev,
      [jobId]: {
        jobId,
        tipo,
        parametros,
        status: 'iniciado',
        progresso: 0,
        createdAt: new Date().toISOString()
      }
    }));
  };

  const updateJob = (jobId, updates) => {
    setActiveJobs(prev => ({
      ...prev,
      [jobId]: { ...prev[jobId], ...updates }
    }));
  };

  const removeJob = (jobId) => {
    setActiveJobs(prev => {
      const next = { ...prev };
      delete next[jobId];
      return next;
    });
  };

  const getJob = (jobId) => activeJobs[jobId];

  return (
    <JobContext.Provider value={{
      activeJobs,
      registerJob,
      updateJob,
      removeJob,
      getJob
    }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within JobProvider');
  }
  return context;
};
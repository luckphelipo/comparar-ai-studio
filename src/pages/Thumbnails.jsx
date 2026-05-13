import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Thumbnails() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/thumb-creator');
  }, [navigate]);

  return null;
}
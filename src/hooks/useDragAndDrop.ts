import { useState, useCallback, DragEvent } from 'react';

export interface DragAndDropHandlers {
  onDragStart?: (event: DragEvent, data: any) => void;
  onDragEnd?: (event: DragEvent) => void;
  onDragOver?: (event: DragEvent) => void;
  onDragEnter?: (event: DragEvent) => void;
  onDragLeave?: (event: DragEvent) => void;
  onDrop?: (event: DragEvent, data: any) => void;
}

export interface UseDragAndDropReturn {
  isDragging: boolean;
  isDragOver: boolean;
  dragHandlers: {
    onDragStart: (event: DragEvent) => void;
    onDragEnd: (event: DragEvent) => void;
    draggable: boolean;
  };
  dropHandlers: {
    onDragOver: (event: DragEvent) => void;
    onDragEnter: (event: DragEvent) => void;
    onDragLeave: (event: DragEvent) => void;
    onDrop: (event: DragEvent) => void;
  };
}

export const useDragAndDrop = (
  data: any,
  handlers: DragAndDropHandlers = {},
  enabled: boolean = true
): UseDragAndDropReturn => {
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = useCallback((event: DragEvent) => {
    if (!enabled) return;
    
    setIsDragging(true);
    event.dataTransfer.setData('application/json', JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
    
    handlers.onDragStart?.(event, data);
  }, [data, handlers.onDragStart, enabled]);

  const handleDragEnd = useCallback((event: DragEvent) => {
    if (!enabled) return;
    
    setIsDragging(false);
    handlers.onDragEnd?.(event);
  }, [handlers.onDragEnd, enabled]);

  const handleDragOver = useCallback((event: DragEvent) => {
    if (!enabled) return;
    
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    handlers.onDragOver?.(event);
  }, [handlers.onDragOver, enabled]);

  const handleDragEnter = useCallback((event: DragEvent) => {
    if (!enabled) return;
    
    event.preventDefault();
    setIsDragOver(true);
    handlers.onDragEnter?.(event);
  }, [handlers.onDragEnter, enabled]);

  const handleDragLeave = useCallback((event: DragEvent) => {
    if (!enabled) return;
    
    // Only set isDragOver to false if we're leaving the drop zone entirely
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
    
    handlers.onDragLeave?.(event);
  }, [handlers.onDragLeave, enabled]);

  const handleDrop = useCallback((event: DragEvent) => {
    if (!enabled) return;
    
    event.preventDefault();
    setIsDragOver(false);
    
    try {
      const droppedData = JSON.parse(event.dataTransfer.getData('application/json'));
      handlers.onDrop?.(event, droppedData);
    } catch (error) {
      console.error('Failed to parse dropped data:', error);
    }
  }, [handlers.onDrop, enabled]);

  return {
    isDragging,
    isDragOver,
    dragHandlers: {
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
      draggable: enabled
    },
    dropHandlers: {
      onDragOver: handleDragOver,
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop
    }
  };
};
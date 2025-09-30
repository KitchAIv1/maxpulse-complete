import { useState, useCallback, useRef } from 'react';
import { FeatureFlags } from '../utils/featureFlags';

/**
 * Custom hook for managing real-time assessment tracking
 * Extracted from ClientHub.tsx to follow .cursorrules
 * 
 * Handles real-time updates via broadcast events and applies them directly to DOM
 * for optimal performance without React re-renders
 */
export function useRealtimeTracking(loadClientDataRef?: React.MutableRefObject<(() => void) | undefined>) {
  // 🚀 PRODUCTION FIX: Buffer for early real-time events
  const [pendingUpdates, setPendingUpdates] = useState<Map<string, any>>(new Map());

  // 🚀 PRODUCTION FIX: Apply buffered updates after DOM is ready
  const applyBufferedUpdates = useCallback(() => {
    if (pendingUpdates.size === 0) return;
    
    console.log('🔄 Applying buffered updates for', pendingUpdates.size, 'sessions');
    
    const appliedUpdates: string[] = [];
    
    pendingUpdates.forEach((updateData, sessionId) => {
      const progressElements = document.querySelectorAll(`[data-session-id="${sessionId}"]`);
      
      if (progressElements.length > 0) {
        console.log('✅ Applying buffered update for:', sessionId, `${updateData.progress}%`);
        
        progressElements.forEach(element => {
          // Update progress bar width
          const progressBar = element.querySelector('.progress-bar');
          if (progressBar) {
            (progressBar as HTMLElement).style.width = `${updateData.progress}%`;
          }
          
          // Update progress text
          const progressText = element.querySelector('.progress-text');
          if (progressText) {
            progressText.textContent = `${updateData.progress}%`;
          }
          
          // Update status text if completed
          if (updateData.eventType === 'assessment_completed') {
            const statusText = element.querySelector('.status-text');
            if (statusText) {
              statusText.textContent = 'completed';
            }
          }
        });
        
        appliedUpdates.push(sessionId);
      }
    });
    
    // Remove applied updates from buffer
    if (appliedUpdates.length > 0) {
      setPendingUpdates(prev => {
        const newMap = new Map(prev);
        appliedUpdates.forEach(sessionId => {
          newMap.delete(sessionId);
          console.log('🗑️ Removed applied update from buffer:', sessionId);
        });
        return newMap;
      });
    }
  }, [pendingUpdates]);

  // Ultra-smooth real-time callback using direct DOM updates
  const handleRealtimeUpdate = useCallback((payload: any) => {
    console.log('🔥 REALTIME UPDATE CALLBACK TRIGGERED:', payload);
    console.log('🔍 Payload structure:', JSON.stringify(payload, null, 2));
    
    // Extract data from broadcast payload
    const eventData = payload.new?.event_data;
    const sessionId = eventData?.code || eventData?.sessionId || payload.new?.id; // Use code first (matches DOM elements)
    const eventType = payload.new?.event_type;
    const currentStep = eventData?.questionNumber;
    const totalSteps = eventData?.totalQuestions;
    
    console.log('🔍 Extracted values:', { sessionId, eventType, currentStep, totalSteps });
    console.log('🔍 Raw eventData:', eventData);
    
    if (sessionId && eventType) {
      // Handle different event types
      let newProgress = 100; // Default for completion events
      let shouldUpdateProgress = false;
      
      if (currentStep && totalSteps) {
        // Question progress events
        newProgress = Math.round((currentStep / totalSteps) * 100);
        shouldUpdateProgress = true;
        console.log('📊 Calculated progress:', newProgress + '%', `(${currentStep}/${totalSteps})`);
      } else if (eventType === 'assessment_completed') {
        // Completion events - set to 100%
        newProgress = 100;
        shouldUpdateProgress = true;
        console.log('🏁 Assessment completed:', sessionId);
      } else {
        // Other events (insights_viewed, plan_viewed) - don't update progress
        console.log('ℹ️ Non-progress event:', eventType);
      }
      
      if (shouldUpdateProgress) {
        // 🎯 MICRO-UPDATE: Update DOM directly without React re-render
        const progressElements = document.querySelectorAll(`[data-session-id="${sessionId}"]`);
  
        console.log('🔍 Looking for DOM elements with session ID:', sessionId);
        console.log('🔍 Found elements:', progressElements.length);
        
        if (progressElements.length > 0) {
          progressElements.forEach(element => {
            // Update progress bar width
            const progressBar = element.querySelector('.progress-bar');
            if (progressBar) {
              (progressBar as HTMLElement).style.width = `${newProgress}%`;
            }
            
            // Update progress text
            const progressText = element.querySelector('.progress-text');
            if (progressText) {
              progressText.textContent = `${newProgress}%`;
            }
            
            // Update status text if completed
            if (eventType === 'assessment_completed') {
              const statusText = element.querySelector('.status-text');
              if (statusText) {
                statusText.textContent = 'completed';
              }
            }
          });
          
          console.log('✅ Micro-update applied:', sessionId, `${newProgress}%`);
        } else {
          // 🚀 PRODUCTION FIX: Session not in DOM - buffer update and trigger reload
          console.log('🔄 Session not in DOM - buffering update for:', sessionId);
          
          // Buffer the update for later application
          const updateData = {
            sessionId,
            eventType,
            progress: newProgress,
            currentStep,
            totalSteps,
            timestamp: Date.now()
          };
          
          setPendingUpdates(prev => {
            const newMap = new Map(prev);
            newMap.set(sessionId, updateData);
            console.log('📦 Buffered update for session:', sessionId, `${newProgress}%`);
            return newMap;
          });
          
          // Check if it's truly new session and trigger reload if needed
          if (loadClientDataRef?.current) {
            console.log('🆕 New session detected - triggering immediate reload:', sessionId);
            loadClientDataRef.current();
          } else {
            console.log('🔄 Existing session - will apply buffered update when DOM ready:', sessionId);
          }
        }
      }
    } else {
      // Invalid payload - skip to prevent container flickering  
      console.log('❌ Invalid payload - missing required fields:', {
        sessionId: !!sessionId,
        eventType: !!eventType, 
        currentStep: !!currentStep,
        totalSteps: !!totalSteps
      });
      // ✅ NO RELOAD: Invalid payloads shouldn't cause container flickering
    }
  }, [setPendingUpdates, loadClientDataRef]);

  return {
    pendingUpdates,
    setPendingUpdates,
    handleRealtimeUpdate,
    applyBufferedUpdates
  };
}

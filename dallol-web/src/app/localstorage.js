export const loadState = () => {
  if(typeof window === 'undefined') {
    return;
  }
  try {
    const serializedState = localStorage.getItem('state');
    if(serializedState === null){
      return undefined;
    }
    return JSON.parse(serializedState);
  }
  catch(e) {
    console.log('error loading local state');
    return undefined;
  }
}

export const saveState = (state) => {
  if(typeof window === 'undefined') {
    return;
  }
  try{
    localStorage.setItem('state', JSON.stringify(state));
  }
  catch(e){
    console.error('error saving state locally');
    localStorage.clear();
  }
}
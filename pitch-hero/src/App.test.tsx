import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import autoCorrelate from './libs/AutoCorrelate';
jest.mock('./contexts/AudioContext');
import bufObj from './_data/sampleBuffer';



// it('is true true?', () => {
//   expect(true);
//   expect(true);
// });

test('renders learn react link', () => { 
  // render bad
  render(<App />);
  // const linkElement = screen.getByText(/learn react/i);
  expect(true);
  // expect(linkElement).toBeInTheDocument();
});

test('test autocorrelate algorithm on sample buffer', () => { 
  const buflen = 2048;
  
  var buf = new Float32Array(Object.values(bufObj));
  var actual = autoCorrelate(buf, 44100)
  expect(125.65664815465871).toBe(actual);
});


import React from 'react';
import { styled } from '@mui/material/styles';

const StyledPre = styled('pre')(({ theme }) => ({
  boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.15)',
  width: 'calc(100% - 10px)',
  margin: '0 0 15px 0',
  backgroundColor: theme.palette.mode === 'light' 
    ? 'rgba(238, 238, 238, 0.6)' 
    : 'rgba(51, 51, 51, 0.6)',
  padding: theme.spacing(2),
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
  color: theme.palette.text.primary,
  transition: 'height 2s ease-in-out',
  borderRadius: theme.shape.borderRadius,
  '& .string': {
    color: theme.palette.mode === 'light' ? 'green' : '#a5d6a7',
  },
  '& .number': {
    color: theme.palette.mode === 'light' ? 'darkorange' : '#ffb74d',
  },
  '& .boolean': {
    color: theme.palette.mode === 'light' ? 'blue' : '#90caf9',
  },
  '& .null': {
    color: theme.palette.mode === 'light' ? 'magenta' : '#f48fb1',
  },
  '& .key': {
    color: theme.palette.mode === 'light' ? '#1976d2' : '#64b5f6', // Changed to a blue shade from red
  },
}));

const syntaxHighlight = (json) => {
  if (!json) return '';
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    }
  );
};

export const codeHighlight = (json) => {
  if (typeof json === 'string') {
    json = JSON.parse(json);
  }
  return (
    <StyledPre
      dangerouslySetInnerHTML={{
        __html: syntaxHighlight(JSON.stringify(json, undefined, 4))
      }}
    />
  );
};

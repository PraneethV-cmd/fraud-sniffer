import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export default function AccordionUsage() {
  return (
    <div>
      {[1, 2, 3].map((index) => (
        <Accordion key={index}>
          <AccordionSummary
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
            sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
          >
            {/* Title */}
            <Typography component="span" sx={{ flexGrow: 1 }}>
              Accordion {index}
            </Typography>

            {/* Edit & Delete Buttons */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" size="small" color="primary">
                Edit
              </Button>
              <Button variant="outlined" size="small" color="error">
                Delete
              </Button>
            </Box>

            {/* Expand More Icon */}
            <ExpandMoreIcon />
          </AccordionSummary>
          <AccordionDetails>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </AccordionDetails>
          <AccordionActions>
            <Button>Cancel</Button>
            <Button>Agree</Button>
          </AccordionActions>
        </Accordion>
      ))}
    </div>
  );
}

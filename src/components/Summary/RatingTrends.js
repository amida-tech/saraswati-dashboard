// These lint ignores relate to a library which specifies to be used this way
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-shadow */
import { useState, useContext } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import {
  Typography, Box,
} from '@mui/material';
import {
  activeMeasureProps, currentResultsProps, trendsProps, widgetPrefsProps,
} from '../Utilities/PropTypes';
import Info from '../Common/Info';
import RatingTrendBox from './RatingTrendBox';
import { DatastoreContext } from '../../context/DatastoreProvider';
import { submeasureResults } from '../Utilities/RatingTrendsValues';
import { ratingTrendsTip } from '../Utilities/RatingTrendValuesUtil'
import { ratingTrendsCompositeContainer, ratingTrendsMeasureContainer } from '../../assets/styles/RatingTrends.style';

function RatingTrends({
  currentResults, activeMeasure, trends, widgetPrefs,
}) {
  const [boxItems, setBoxOrder] = useState(Object.values(widgetPrefs));
  const { datastore, datastoreActions } = useContext(DatastoreContext);

  function handleOnDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(boxItems);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setBoxOrder(items);
    delete datastore.preferences.ratingTrends;
    datastoreActions?.setPreferences({ ratingTrends: items, ...datastore.preferences });
  }

  // MEASURE VIEW
  if (activeMeasure.measure !== 'composite' && activeMeasure.measure !== '') {
    const measurePreferences = submeasureResults(activeMeasure, trends);
    return (
      <Box sx={{ m: '0 1rem' }}>
        <Box sx={{ display: 'flex', mb: '1rem' }}>
          <Typography variant="h4" sx={{ fontWeight: '600' }}>
            Ratings & Trends
          </Typography>
          <Info infoText={ratingTrendsTip} />
        </Box>

        {datastore.comparisonMode === 'default' && (
          <Box sx={ratingTrendsMeasureContainer}>
            {Object.values(measurePreferences).map((pref, idx) => (
              <RatingTrendBox
                key={`${pref.measure}'s ${pref.type}`}
                activeMeasure={activeMeasure}
                widgetPrefs={measurePreferences[idx]}
                trends={trends}
                currentResults={currentResults}
                order={idx}
              />
            ))}
          </Box>
        )}
      </Box>
    );
  }
  // COMPOSITE VIEW
  return (
    <Box sx={{ m: '0 1rem' }}>
      <Box sx={{ display: 'flex', mb: '1rem' }}>
        <Typography variant="h4" sx={{ fontWeight: '600' }}>
          Ratings & Trends
        </Typography>
        <Info infoText={ratingTrendsTip} />
      </Box>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="ratings" direction="horizontal">
          {(provided) => (
            <Box
              sx={ratingTrendsCompositeContainer}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >

              {boxItems.map((widget, idx) => (
                <Draggable
                  key={`${widget.measure}'s ${widget.type}`}
                  draggableId={`${widget.measure}-${widget.type}`}
                  index={idx}
                >
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      <RatingTrendBox
                        activeMeasure={activeMeasure}
                        widgetPrefs={widget}
                        trends={trends}
                        currentResults={currentResults}
                      />
                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

    </Box>
  );
}

RatingTrends.propTypes = {
  activeMeasure: activeMeasureProps,
  trends: trendsProps,
  widgetPrefs: widgetPrefsProps,
  currentResults: currentResultsProps,
};

RatingTrends.defaultProps = {
  activeMeasure: {},
  trends: {},
  widgetPrefs: {},
  currentResults: {},
};

export default RatingTrends;

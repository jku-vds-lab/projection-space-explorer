import * as React from 'react';
import { ConnectedComponent, useDispatch, useSelector } from 'react-redux';
import { ComponentConfig } from "../../../BaseConfig";
import { DetailViewActions } from '../../Ducks/DetailViewDuck';
import type { RootState } from '../../Store/Store';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import StarIcon from '@mui/icons-material/Star';
import { over } from 'lodash';

type DetailViewChooserProps = {
    overrideComponents: ComponentConfig
}

function instantiateElement(view: JSX.Element | (() => JSX.Element) | ConnectedComponent<any, any>) {
    if (!view) return null;

    return React.isValidElement(view)
        ? view
        : React.createElement(view as React.FunctionComponent, {})
}

export function ViewsTabPanel({ overrideComponents }: DetailViewChooserProps) {
    const dispatch = useDispatch();

    const detailView = useSelector((state: RootState) => state.detailView);

    if (!overrideComponents || !overrideComponents.detailViews || overrideComponents.detailViews.length === 0) {
        return null;
    }

    const view = overrideComponents.detailViews[detailView.active].settings

    const onViewChange = (view: string) => {
        dispatch(DetailViewActions.setDetailView(overrideComponents.detailViews.findIndex((e) => e.name === view)))
    }

    return <div style={{ display: 'flex', flexDirection: 'column' }}>
        <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            aria-label="contacts"
        >
            {
                overrideComponents.detailViews.map((dv, i) => {
                    return <ListItem disablePadding>
                        <ListItemButton selected={detailView.active === i} onClick={() => onViewChange(dv.name)}>
                            {detailView.active === i ? <ListItemIcon>
                                <StarIcon />
                            </ListItemIcon> : null}
                            <ListItemText primary={dv.name} />
                        </ListItemButton>
                    </ListItem>
                })
            }

        </List>
        {
            instantiateElement(view)
        }
    </div>
}
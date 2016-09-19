import React from 'react';

// Bootstrap
import {FormGroup, FormControl} from 'react-bootstrap';

export default class SearchBar extends React.Component
{
	render() 
	{
		return (
			<div className='searchbar'>
				<FormGroup bsSize="large">
					<FormControl type="text" placeholder="Search" onChange={this.props.onChange} />
				</FormGroup>
			</div>
		);
	}
}
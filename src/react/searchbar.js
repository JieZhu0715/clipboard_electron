import React from 'react';

export default class SearchBar extends React.Component
{
	render() 
	{
		return (
			<div className='searchbar'>
				<input type='text' onChange={this.props.onChange}/>
			</div>
		);
	}
}
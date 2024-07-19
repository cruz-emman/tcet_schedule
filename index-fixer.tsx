<DropdownMenuPortal>
    <DropdownMenuSubContent>
        <DropdownMenuItem
            onClick={() => approvedButton(id)}
        >
            <Check className="mr-2 h-4 w-4 text-emerald-600" />
            <span>Approved</span>
        </DropdownMenuItem>
        <DropdownMenuItem
            onClick={() => pendingButton(id)}
        >
            <CircleDot className="mr-2 h-4 w-4 text-rose-600" />
            <span>Pending</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
    </DropdownMenuSubContent>
</DropdownMenuPortal>
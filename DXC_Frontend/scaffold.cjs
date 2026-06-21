const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'features');

function copyAndReplace(sourcePath, targetPath, replacements) {
    if (fs.statSync(sourcePath).isDirectory()) {
        if (!fs.existsSync(targetPath)) {
            fs.mkdirSync(targetPath, { recursive: true });
        }
        const files = fs.readdirSync(sourcePath);
        for (const file of files) {
            let newFileName = file;
            for (const { from, to } of replacements) {
                newFileName = newFileName.replace(new RegExp(from, 'g'), to);
            }
            copyAndReplace(path.join(sourcePath, file), path.join(targetPath, newFileName), replacements);
        }
    } else {
        let content = fs.readFileSync(sourcePath, 'utf8');
        for (const { from, to } of replacements) {
            content = content.replace(new RegExp(from, 'g'), to);
        }
        fs.writeFileSync(targetPath, content);
    }
}

// Scaffold Tours from Hotels
const hotelsDir = path.join(srcDir, 'hotels');
const toursDir = path.join(srcDir, 'tours');
copyAndReplace(hotelsDir, toursDir, [
    { from: 'Hotel', to: 'Tour' },
    { from: 'hotel', to: 'tour' },
    { from: 'HOTEL', to: 'TOUR' },
    { from: 'Hotels', to: 'Tours' },
    { from: 'hotels', to: 'tours' },
    { from: 'Khách sạn', to: 'Tour' },
    { from: 'khách sạn', to: 'tour' },
    { from: 'zaloMiniAppHotelsAdmin', to: 'zaloMiniAppToursAdmin' }
]);

// Scaffold Tickets from Roles
const rolesDir = path.join(srcDir, 'roles');
const ticketsDir = path.join(srcDir, 'tickets');
copyAndReplace(rolesDir, ticketsDir, [
    { from: 'Role', to: 'Ticket' },
    { from: 'role', to: 'ticket' },
    { from: 'ROLE', to: 'TICKET' },
    { from: 'Roles', to: 'Tickets' },
    { from: 'roles', to: 'tickets' },
    { from: 'Vai trò', to: 'Vé' },
    { from: 'vai trò', to: 'vé' },
    { from: 'Permissions', to: 'Price' }, // specific adjustments
    { from: 'permissions', to: 'price' },
    { from: 'getRoles', to: 'zaloMiniAppTicketsAdminGetTickets' },
    { from: 'createRole', to: 'zaloMiniAppTicketsAdminCreateTicket' },
    { from: 'updateRole', to: 'zaloMiniAppTicketsAdminUpdateTicket' },
    { from: 'deleteRole', to: 'zaloMiniAppTicketsAdminDeleteTicket' },
    { from: 'getRoleById', to: 'zaloMiniAppTicketsAdminGetTicketById' }
]);

// Scaffold Orders from Roles
const ordersDir = path.join(srcDir, 'orders');
copyAndReplace(rolesDir, ordersDir, [
    { from: 'Role', to: 'Order' },
    { from: 'role', to: 'order' },
    { from: 'ROLE', to: 'ORDER' },
    { from: 'Roles', to: 'Orders' },
    { from: 'roles', to: 'orders' },
    { from: 'Vai trò', to: 'Đơn hàng' },
    { from: 'vai trò', to: 'đơn hàng' },
    { from: 'getRoles', to: 'zaloMiniAppOrdersAdminGetOrders' },
    { from: 'createRole', to: 'zaloMiniAppOrdersAdminCreateOrder' },
    { from: 'updateRole', to: 'zaloMiniAppOrdersAdminUpdateOrder' },
    { from: 'deleteRole', to: 'zaloMiniAppOrdersAdminDeleteOrder' },
    { from: 'getRoleById', to: 'zaloMiniAppOrdersAdminGetOrderById' }
]);

// Scaffold Transactions from Roles
const transactionsDir = path.join(srcDir, 'transactions');
copyAndReplace(rolesDir, transactionsDir, [
    { from: 'Role', to: 'Transaction' },
    { from: 'role', to: 'transaction' },
    { from: 'ROLE', to: 'TRANSACTION' },
    { from: 'Roles', to: 'Transactions' },
    { from: 'roles', to: 'transactions' },
    { from: 'Vai trò', to: 'Giao dịch' },
    { from: 'vai trò', to: 'giao dịch' },
    { from: 'getRoles', to: 'zaloMiniAppTransactionsAdminGetTransactions' },
    { from: 'createRole', to: 'zaloMiniAppTransactionsAdminCreateTransaction' },
    { from: 'updateRole', to: 'zaloMiniAppTransactionsAdminUpdateTransaction' },
    { from: 'deleteRole', to: 'zaloMiniAppTransactionsAdminDeleteTransaction' },
    { from: 'getRoleById', to: 'zaloMiniAppTransactionsAdminGetTransactionById' }
]);

console.log("Scaffolding complete!");
